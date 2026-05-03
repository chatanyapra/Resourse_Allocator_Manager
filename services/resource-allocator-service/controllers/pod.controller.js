import * as k8s from "@kubernetes/client-node";
import { createDeployment, createIngress, createService, deleteDeployment, deleteIngress, deleteService, ensureIngressPortForward, getIngressIp, getCurrentIngressPort } from "../kubernetes/k8s.service.js";
import { selectBestNode } from "../scheduler/schedulerClient.js";
import { createDeploymentManifest } from "../utils/deplyment-menifest.js";
import { createIngressManifest } from "../utils/ingress-manifest.js";
import { createServiceManifest } from "../utils/service-menifest.js";
import DatabaseService from "../services/database.service.js";

export async function allocateResource(req, res) {
    let allocationRecord = null;

    try {
        // Get authenticated user from JWT middleware
        const authenticatedUserId = req.user.id;

        // Extract user input with defaults
        let {
            email,
            cpu = 200,
            memory = 256,
            image = "nginx",
            port = 80,
        } = req.body;

        cpu = parseInt(cpu, 10);
        memory = parseInt(memory, 10);
        port = parseInt(port, 10);

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: "Invalid email format"
                });
            }
        }

        // Validate resource limits
        if (cpu < 50 || cpu > 1000) {
            return res.status(400).json({
                error: "CPU must be between 50 and 1000 millicores"
            });
        }

        if (memory < 64 || memory > 4096) {
            return res.status(400).json({
                error: "Memory must be between 64 and 4096 MB"
            });
        }

        console.log('🔍 Processing allocation request for:', { authenticatedUserId, email, cpu, memory, image, port });

        const node = await selectBestNode();
        const emailPrefix = email ? email.split('@')[0] : authenticatedUserId.substring(0, 8);
        const appName = `user-${Date.now()}-${emailPrefix}`;

        // Use authenticated user ID from JWT; optionally update email via findOrCreateUser
        console.log('🔍 About to call findOrCreateUser...');
        const user = await DatabaseService.findOrCreateUser(authenticatedUserId, email || `user-${authenticatedUserId}@app.local`);
        const userIdToUse = user.id;

        if (!userIdToUse) {
            throw new Error('User ID is null or undefined after user creation');
        }

        console.log('✅ User ready:', { id: userIdToUse, email: user.email });
        console.log('🔍 Using userId:', userIdToUse);

        // Create database record first
        allocationRecord = await DatabaseService.createAllocation({
            userId: String(userIdToUse),
            appName,
            node,
            cpu,
            memory,
            image,
            port
        });

        console.log('✅ Allocation record created:', allocationRecord.id);

        // Ensure ingress controller is port-forwarded
        const portForward = await ensureIngressPortForward();
        console.log(`Ingress controller port-forwarded to localhost:${portForward}`);

        // Create manifests
        const metalLBIp = await getIngressIp();
        const deployment = createDeploymentManifest({
            nodeName: node,
            appName,
            image,
            cpu: `${cpu}m`,
            memory: `${memory}Mi`,
            port,
            userId: userIdToUse
        });

        const service = createServiceManifest(appName, port);
        const ingressManifest = createIngressManifest({ appName, metalLBIp });

        // Update status to DEPLOYING
        await DatabaseService.updateAllocationStatus(appName, 'DEPLOYING');

        // Deploy to Kubernetes
        const deploymentResult = await createDeployment(deployment);
        const serviceResult = await createService(service);
        const ingressResult = await createIngress(ingressManifest, "default");

        // Update status to RUNNING with K8s resource IDs and URL
        const url = `http://${appName}.${metalLBIp}.nip.io:${portForward}`;
        await DatabaseService.updateAllocationWithK8sResources(appName, {
            deploymentId: deploymentResult.body?.metadata?.name || deploymentResult.metadata?.name,
            serviceId: serviceResult.body?.metadata?.name || serviceResult.metadata?.name,
            ingressId: ingressResult.body?.metadata?.name || ingressResult.metadata?.name,
            url
        });

        // RETURN TO USER
        res.json({
            success: true,
            appName,
            node,
            url,
            allocationId: allocationRecord.id,
            userId: userIdToUse,
            resources: {
                cpu,
                memory,
                image,
                port
            },
            status: 'RUNNING'
        });

    } catch (err) {
        console.error('Allocation failed:', err);

        // Update database record if it was created
        if (allocationRecord) {
            try {
                await DatabaseService.updateAllocationStatus(
                    allocationRecord.appName,
                    'FAILED',
                    { error: err.message }
                );
            } catch (dbErr) {
                console.error('Failed to update allocation status:', dbErr);
            }
        }

        res.status(500).json({
            error: err.message,
            allocationId: allocationRecord?.id
        });
    }
}

// delete pods-
export async function deletePod(req, res) {
    try {
        const { appName } = req.params;
        const authenticatedUserId = req.user.id;

        // Get allocation details first
        const allocation = await DatabaseService.getAllocationByAppName(appName);

        if (!allocation) {
            return res.status(404).json({
                error: 'Pod allocation not found'
            });
        }

        // Verify the authenticated user owns this allocation
        if (allocation.userId !== authenticatedUserId) {
            return res.status(403).json({
                error: 'You do not have permission to delete this pod'
            });
        }

        // Clean up Kubernetes resources in reverse order (ingress → service → deployment)
        console.log(`🧹 Cleaning up Kubernetes resources for pod: ${appName}`);

        const cleanupResults = {
            ingress: null,
            service: null,
            deployment: null
        };

        // Delete ingress first (removes external access)
        if (allocation.ingressId) {
            try {
                cleanupResults.ingress = await deleteIngress(allocation.ingressId);
                console.log(`✅ Ingress ${allocation.ingressId} cleaned up`);
            } catch (error) {
                console.error(`⚠️ Failed to delete ingress ${allocation.ingressId}:`, error.message);
                // Continue with other cleanup even if ingress fails
            }
        }

        // Delete service second (removes internal load balancing)
        if (allocation.serviceId) {
            try {
                cleanupResults.service = await deleteService(allocation.serviceId);
                console.log(`✅ Service ${allocation.serviceId} cleaned up`);
            } catch (error) {
                console.error(`⚠️ Failed to delete service ${allocation.serviceId}:`, error.message);
                // Continue with deployment cleanup even if service fails
            }
        }

        // Delete deployment last (removes actual pods and containers)
        if (allocation.deploymentId) {
            try {
                cleanupResults.deployment = await deleteDeployment(allocation.deploymentId);
                console.log(`✅ Deployment ${allocation.deploymentId} cleaned up`);
            } catch (error) {
                console.error(`⚠️ Failed to delete deployment ${allocation.deploymentId}:`, error.message);
                // Continue with database update even if deployment fails
            }
        }

        console.log(`🎯 Kubernetes cleanup completed for pod: ${appName}`);

        // Update database record
        await DatabaseService.updateAllocationStatus(appName, 'DELETED');

        res.json({
            success: true,
            message: 'Pod allocation marked as deleted'
        });
    } catch (error) {
        console.error("Error deleting pod:", error);
        res.status(500).json({ error: "Failed to delete pod" });
    }
}

export async function getPodById(req, res) {
    try {
        const { appName } = req.params;

        const allocation = await DatabaseService.getAllocationByAppName(appName);

        if (!allocation) {
            return res.status(404).json({
                error: 'Pod allocation not found'
            });
        }

        // If pod is running, ensure port-forward is active
        let ingressPort = getCurrentIngressPort();
        if (allocation.status === 'RUNNING') {
            try {
                ingressPort = await ensureIngressPortForward();
                console.log(`[getPodById] Ingress port-forward ensured on localhost:${ingressPort} for pod: ${appName}`);
            } catch (pfError) {
                console.error(`[getPodById] Failed to ensure port-forward for pod ${appName}:`, pfError.message);
            }
        }

        // Update URL with current port (in case server restarted on different port)
        let currentUrl = allocation.url;
        if (allocation.status === 'RUNNING' && currentUrl) {
            // Replace port in URL with current ingress port
            const urlObj = new URL(currentUrl);
            if (urlObj.port !== String(ingressPort)) {
                urlObj.port = ingressPort;
                currentUrl = urlObj.toString();
            }
        }

        res.json({
            success: true,
            pod: {
                ...allocation,
                url: currentUrl
            },
            ingressPort
        });
    } catch (error) {
        console.error("Error retrieving pod:", error);
        res.status(500).json({ error: "Failed to retrieve pod" });
    }
}

export async function getUserPods(req, res) {
    try {
        // Get authenticated user ID from JWT middleware
        const userId = req.user.id;

        const allocations = await DatabaseService.getAllocationsByUserId(userId);

        // Check if any pods are running and ensure port-forward is active
        let ingressPort = getCurrentIngressPort();
        const hasRunningPods = allocations.some(a => a.status === 'RUNNING');
        if (hasRunningPods) {
            try {
                ingressPort = await ensureIngressPortForward();
            } catch (pfError) {
                console.error('[getUserPods] Failed to ensure port-forward:', pfError.message);
            }
        }

        // Update URLs with current port
        const updatedAllocations = allocations.map(allocation => {
            if (allocation.status === 'RUNNING' && allocation.url) {
                const urlObj = new URL(allocation.url);
                if (urlObj.port !== String(ingressPort)) {
                    urlObj.port = ingressPort;
                    return { ...allocation, url: urlObj.toString() };
                }
            }
            return allocation;
        });

        res.json({
            success: true,
            pods: updatedAllocations,
            total: allocations.length,
            ingressPort
        });
    } catch (error) {
        console.error("Error retrieving user pods:", error);
        res.status(500).json({ error: "Failed to retrieve user pods" });
    }
}

export async function getAllPods(req, res) {
    try {
        const allocations = await DatabaseService.getAllAllocations();

        res.json({
            success: true,
            pods: allocations,
            total: allocations.length
        });
    } catch (error) {
        console.error("Error retrieving all pods:", error);
        res.status(500).json({ error: "Failed to retrieve all pods" });
    }
}

export async function getPodStats(req, res) {
    try {
        const stats = await DatabaseService.getAllocationStats();

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error("Error retrieving pod stats:", error);
        res.status(500).json({ error: "Failed to retrieve pod stats" });
    }
}

export async function getPodsGroupedByNodeHandler(req, res) {
    try {
        const grouped = await getPodsGroupedByNode();

        res.json({
            success: true,
            grouped,
            message: 'Pods grouped by node retrieved successfully'
        });
    } catch (error) {
        console.error('Error retrieving grouped pods:', error);
        res.status(500).json({ error: 'Failed to retrieve grouped pods' });
    }
}

export async function getAllPodsWithNodes() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const res = await k8sApi.listPodForAllNamespaces();

    console.log('🔍 K8s API Response structure:', {
        hasBody: !!res.body,
        hasItems: !!(res.body?.items || res.items),
        bodyKeys: res.body ? Object.keys(res.body) : 'no body',
        resKeys: Object.keys(res),
        responseType: typeof res
    });

    // The response structure is different - items is at root level, not in body
    const podItems = res.body || res;

    if (!podItems.items) {
        console.error('❌ No items found in Kubernetes response:', Object.keys(res));
        console.error('❌ Response data:', JSON.stringify(res, null, 2).substring(0, 500) + '...');
        return [];
    }

    const pods = podItems.items.map(pod => ({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        node: pod.spec.nodeName,
        status: pod.status.phase,
        ip: pod.status.podIP
    }));

    console.log(`✅ Found ${pods.length} pods`);
    return pods;
}

// Express route handler for getting all pods with nodes
export async function listAllPodsWithNodes(req, res) {
    try {
        const pods = await getAllPodsWithNodes();
        res.json({
            success: true,
            pods: pods,
            total: pods.length
        });
    } catch (error) {
        console.error("Error retrieving pods with nodes:", error);
        res.status(500).json({ error: "Failed to retrieve pods with nodes" });
    }
}

export async function getPodsGroupedByNode() {
    const pods = await getAllPodsWithNodes();

    const grouped = {};

    pods.forEach(pod => {
        if (!grouped[pod.node]) {
            grouped[pod.node] = [];
        }
        grouped[pod.node].push(pod);
    });

    return grouped;
}