import { streamPodLogs } from "../services/log.service.js";
import { watchPodStatus } from "../services/pod.service.js";

/**
 * Socket.IO handler for real-time pod log streaming and status tracking.
 *
 * Events:
 *   ← watch-app   { appName: string }   Start watching logs + status for an app
 *   ← stop-watch  { appName: string }   Stop watching logs + status
 *   → log-update  { podName, message, timestamp, level }
 *   → pod-status  { appName, aggregateStatus, pods[], timestamp }
 *   → watch-error { message }
 */
export const podSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Track active watchers per socket so we can clean up on disconnect
        const activeWatchers = new Map(); // appName → { cleanupLogs, cleanupStatus }

        socket.on("watch-app", async ({ appName }) => {
            if (!appName || typeof appName !== "string") {
                socket.emit("watch-error", {
                    message: "Invalid or missing appName",
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            const sanitized = appName.trim();
            console.log(`[Socket] ${socket.id} → watch-app: "${sanitized}"`);

            // If already watching this app, tear down old watchers first
            if (activeWatchers.has(sanitized)) {
                const old = activeWatchers.get(sanitized);
                old.cleanupLogs?.();
                old.cleanupStatus?.();
                activeWatchers.delete(sanitized);
                console.log(`[Socket] Cleaned up previous watchers for "${sanitized}"`);
            }

            try {
                // Start log streaming (async — returns cleanup fn)
                const cleanupLogs = await streamPodLogs(sanitized, socket);

                // Start pod status polling (sync — returns cleanup fn)
                const cleanupStatus = watchPodStatus(sanitized, socket);

                activeWatchers.set(sanitized, { cleanupLogs, cleanupStatus });

                socket.emit("log-update", {
                    podName: "system",
                    message: `[INFO] Started watching app "${sanitized}"`,
                    timestamp: new Date().toISOString(),
                    level: "info",
                });
            } catch (err) {
                console.error(`[Socket] Error setting up watchers for "${sanitized}":`, err);
                socket.emit("watch-error", {
                    message: `Failed to start watching "${sanitized}": ${err.message}`,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        socket.on("stop-watch", ({ appName }) => {
            if (!appName) return;

            const sanitized = appName.trim();
            console.log(`[Socket] ${socket.id} → stop-watch: "${sanitized}"`);

            if (activeWatchers.has(sanitized)) {
                const watcher = activeWatchers.get(sanitized);
                watcher.cleanupLogs?.();
                watcher.cleanupStatus?.();
                activeWatchers.delete(sanitized);
            }
        });

        socket.on("disconnect", (reason) => {
            console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);

            // Clean up ALL active watchers for this socket
            for (const [appName, watcher] of activeWatchers) {
                console.log(`[Socket] Cleaning up watcher for "${appName}" (socket ${socket.id})`);
                watcher.cleanupLogs?.();
                watcher.cleanupStatus?.();
            }
            activeWatchers.clear();
        });
    });
};