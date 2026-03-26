import { coreApi, k8sApi, k8sNetworkingApi } from "./client.js";
import { spawn } from 'child_process';

// Store active port forwards
const activePortForwards = new Map();

export async function getIngressIp() {
    return "127.0.0.1"; // Always use localhost for port-forward approach
}

export async function ensureIngressPortForward() {
    const forwardKey = 'ingress-controller';

    // Check if port-forward already exists
    if (activePortForwards.has(forwardKey)) {
        return activePortForwards.get(forwardKey);
    }

    return new Promise((resolve, reject) => {
        // Port-forward ingress controller to localhost:8080
        const portForward = spawn('kubectl', [
            'port-forward',
            'svc/ingress-nginx-controller',
            '8080:80',
            '-n', 'ingress-nginx'
        ]);

        let port = 8080;

        portForward.stdout.on('data', (data) => {
            console.log(`Port-forward output: ${data}`);
            if (data.toString().includes('Forwarding from')) {
                activePortForwards.set(forwardKey, port);
                resolve(port);
            }
        });

        portForward.stderr.on('data', (data) => {
            console.error(`Port-forward error: ${data}`);
        });

        portForward.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Port-forward failed with code ${code}`));
            }
        });

        // Give it time to start
        setTimeout(() => {
            if (!activePortForwards.has(forwardKey)) {
                activePortForwards.set(forwardKey, port);
                resolve(port);
            }
        }, 3000);
    });
}

export async function createDeployment(manifest) {
    try {
        console.log('Creating deployment with manifest:', JSON.stringify(manifest, null, 2));
        const result = await k8sApi.createNamespacedDeployment({
            namespace: "default",
            body: manifest
        });
        console.log('Deployment created successfully:', result.metadata?.name || result.body?.metadata?.name);
        return result;
    } catch (error) {
        console.error('Error creating deployment:', error.message);
        if (error.response) {
            console.error('Kubernetes API error:', error.response.body);
        }
        throw error;
    }
}

export async function createService(serviceManifest) {
    try {
        console.log('Creating service with manifest:', JSON.stringify(serviceManifest, null, 2));
        const response = await coreApi.createNamespacedService({
            namespace: "default",
            body: serviceManifest
        });
        console.log('Service created successfully:', response.metadata?.name || response.body?.metadata?.name);
        return response;
    } catch (error) {
        console.error('Error creating service:', error.message);
        if (error.response) {
            console.error('Kubernetes API error:', error.response.body);
        }
        throw error;
    }
}

export async function createIngress(manifest, namespace = "default") {
    try {
        console.log('Creating ingress with manifest:', JSON.stringify(manifest, null, 2));
        const result = await k8sNetworkingApi.createNamespacedIngress({
            namespace: namespace,
            body: manifest
        });
        console.log('Ingress created successfully:', result.metadata?.name || result.body?.metadata?.name);
        return result;
    } catch (error) {
        console.error('Error creating ingress:', error.message);
        if (error.response) {
            console.error('Kubernetes API error:', error.response.body);
        }
        throw error;
    }
}

export async function deleteDeployment(deploymentName, namespace = "default") {
    try {
        console.log(`🗑️ Deleting deployment: ${deploymentName} in namespace: ${namespace}`);

        const result = await k8sApi.deleteNamespacedDeployment({
            name: deploymentName,
            namespace: namespace,
            body: {
                gracePeriodSeconds: 30,
                propagationPolicy: 'Foreground'
            }
        });

        console.log(`✅ Deployment ${deploymentName} deleted successfully`);
        return result;
    } catch (error) {
        console.error(`❌ Error deleting deployment ${deploymentName}:`, error.message);

        // Handle specific error cases
        if (error.response?.statusCode === 404) {
            console.log(`⚠️ Deployment ${deploymentName} not found (already deleted)`);
            return { status: 'not_found' };
        }

        if (error.response) {
            console.error('Kubernetes API error:', error.response.body);
        }
        throw error;
    }
}

export async function deleteService(serviceName, namespace = "default") {
    try {
        console.log(`🗑️ Deleting service: ${serviceName} in namespace: ${namespace}`);

        const result = await coreApi.deleteNamespacedService({
            name: serviceName,
            namespace: namespace,
            body: {
                gracePeriodSeconds: 30
            }
        });

        console.log(`✅ Service ${serviceName} deleted successfully`);
        return result;
    } catch (error) {
        console.error(`❌ Error deleting service ${serviceName}:`, error.message);

        // Handle specific error cases
        if (error.response?.statusCode === 404) {
            console.log(`⚠️ Service ${serviceName} not found (already deleted)`);
            return { status: 'not_found' };
        }

        if (error.response) {
            console.error('Kubernetes API error:', error.response.body);
        }
        throw error;
    }
}

export async function deleteIngress(ingressName, namespace = "default") {
    try {
        console.log(`🗑️ Deleting ingress: ${ingressName} in namespace: ${namespace}`);

        const result = await k8sNetworkingApi.deleteNamespacedIngress({
            name: ingressName,
            namespace: namespace,
            body: {
                gracePeriodSeconds: 30
            }
        });

        console.log(`✅ Ingress ${ingressName} deleted successfully`);
        return result;
    } catch (error) {
        console.error(`❌ Error deleting ingress ${ingressName}:`, error.message);

        // Handle specific error cases
        if (error.response?.statusCode === 404) {
            console.log(`⚠️ Ingress ${ingressName} not found (already deleted)`);
            return { status: 'not_found' };
        }

        if (error.response) {
            console.error('Kubernetes API error:', error.response.body);
        }
        throw error;
    }
}

export async function cleanupPortForwards() {
    for (const [key, process] of activePortForwards) {
        if (process && process.kill) {
            process.kill();
        }
    }
    activePortForwards.clear();
}