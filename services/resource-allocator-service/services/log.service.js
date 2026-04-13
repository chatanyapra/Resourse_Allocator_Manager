import stream from "stream";
import { coreApi, log } from "../kubernetes/client.js";

/**
 * Resolve all pods for a given appName via label selector `app=<appName>`.
 * Returns an array of pod metadata objects sorted by creation time (newest first).
 */
async function getPodsByAppName(appName, namespace = "default") {
    const res = await coreApi.listNamespacedPod({
        namespace,
        labelSelector: `app=${appName}`,
    });

    const pods = (res.items || []).sort((a, b) => {
        const dateA = new Date(a.metadata.creationTimestamp);
        const dateB = new Date(b.metadata.creationTimestamp);
        return dateB - dateA; // newest first
    });

    return pods;
}

/**
 * Stream real-time logs from ALL pods matching the given appName.
 * Each pod's logs are merged into the socket via `log-update` events.
 *
 * @param {string}   appName   The Kubernetes label value  (label: app=<appName>)
 * @param {object}   socket    Socket.IO socket instance
 * @param {string}   namespace Kubernetes namespace (default: "default")
 * @returns {Function}         Cleanup function that tears down all log streams
 */
export async function streamPodLogs(appName, socket, namespace = "default") {
    const activeStreams = [];

    try {
        const pods = await getPodsByAppName(appName, namespace);

        if (pods.length === 0) {
            socket.emit("log-update", {
                podName: "system",
                message: `[WARN] No pods found for app "${appName}". Waiting for pods to start...\n`,
                timestamp: new Date().toISOString(),
                level: "warn",
            });
            return () => {};
        }

        socket.emit("log-update", {
            podName: "system",
            message: `[INFO] Found ${pods.length} pod(s) for app "${appName}". Streaming logs...\n`,
            timestamp: new Date().toISOString(),
            level: "info",
        });

        for (const pod of pods) {
            const podName = pod.metadata.name;
            const phase = pod.status?.phase;

            // Only stream logs from pods that could have logs
            if (phase === "Pending") {
                socket.emit("log-update", {
                    podName,
                    message: `[INFO] Pod "${podName}" is Pending — logs will stream when container starts.\n`,
                    timestamp: new Date().toISOString(),
                    level: "info",
                });
                continue;
            }

            try {
                const logStream = new stream.PassThrough();

                // Pick the first container name from the pod spec
                const containerName = pod.spec.containers?.[0]?.name || "";

                await log.log(namespace, podName, containerName, logStream, {
                    follow: true,
                    tailLines: 100,
                    pretty: false,
                    timestamps: true,
                });

                logStream.on("data", (chunk) => {
                    const raw = chunk.toString();
                    const lines = raw.split("\n").filter(Boolean);

                    for (const line of lines) {
                        socket.emit("log-update", {
                            podName,
                            message: line,
                            timestamp: new Date().toISOString(),
                            level: detectLogLevel(line),
                        });
                    }
                });

                logStream.on("error", (err) => {
                    socket.emit("log-update", {
                        podName,
                        message: `[ERROR] Log stream error for "${podName}": ${err.message}\n`,
                        timestamp: new Date().toISOString(),
                        level: "error",
                    });
                });

                logStream.on("end", () => {
                    socket.emit("log-update", {
                        podName,
                        message: `[INFO] Log stream ended for "${podName}".\n`,
                        timestamp: new Date().toISOString(),
                        level: "info",
                    });
                });

                activeStreams.push(logStream);
            } catch (podErr) {
                socket.emit("log-update", {
                    podName,
                    message: `[ERROR] Failed to stream logs for pod "${podName}": ${podErr.message}\n`,
                    timestamp: new Date().toISOString(),
                    level: "error",
                });
            }
        }
    } catch (err) {
        socket.emit("log-update", {
            podName: "system",
            message: `[ERROR] Failed to fetch pods for "${appName}": ${err.message}\n`,
            timestamp: new Date().toISOString(),
            level: "error",
        });
    }

    // Return cleanup function
    return () => {
        for (const s of activeStreams) {
            try {
                s.destroy();
            } catch (_) {
                // ignore
            }
        }
    };
}

/**
 * Detect log level from line content for frontend colour-coding.
 */
function detectLogLevel(line) {
    const lower = line.toLowerCase();
    if (lower.includes("error") || lower.includes("fatal") || lower.includes("panic")) return "error";
    if (lower.includes("warn")) return "warn";
    if (lower.includes("debug")) return "debug";
    return "info";
}