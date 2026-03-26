export function createServiceManifest(appName, port = 80) {
    return {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            name: `${appName}-service`
        },
        spec: {
            type: "ClusterIP",
            selector: {
                app: appName
            },
            ports: [
                {
                    port: 80,           // Ingress connects to this
                    targetPort: port    // Forwards to the actual container port (e.g. 5800)
                }
            ]
        }
    };
}
