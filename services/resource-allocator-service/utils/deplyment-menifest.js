export function createDeploymentManifest({
    nodeName,
    appName,
    image = "nginx",
    cpu = "200m",
    memory = "256Mi",
    port = 80,
    userId
}) {
    return {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
            name: `${appName}-deployment`,
            labels: {
                app: appName,
                user: userId
            }
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: { app: appName }
            },
            template: {
                metadata: {
                    labels: {
                        app: appName,
                        user: userId
                    }
                },
                spec: {
                    nodeSelector: {
                        "role": "apps"   // matches worker2 and worker3
                    },
                    containers: [
                        {
                            name: appName,
                            image,
                            ports: [
                                {
                                    containerPort: port
                                }
                            ],
                            resources: {
                                requests: {
                                    cpu,
                                    memory
                                },
                                limits: {
                                    cpu,
                                    memory
                                }
                            },
                            // Use TCP socket probe — many images (jlesage/firefox, code-server, etc.)
                            // serve WebSocket-heavy UIs that don't respond to plain HTTP GET.
                            readinessProbe: {
                                tcpSocket: {
                                    port: port
                                },
                                initialDelaySeconds: 30,
                                periodSeconds: 10,
                                failureThreshold: 6
                            },
                            // /dev/shm is essential for browser-based images (Firefox, Chrome, etc.)
                            // Default Docker shm is only 64MB — Firefox will crash without this.
                            volumeMounts: [
                                {
                                    name: "dshm",
                                    mountPath: "/dev/shm"
                                },
                                {
                                    name: "config",
                                    mountPath: "/config"
                                }
                            ]
                        }
                    ],
                    volumes: [
                        {
                            name: "dshm",
                            emptyDir: {
                                medium: "Memory",
                                sizeLimit: "256Mi"
                            }
                        },
                        {
                            name: "config",
                            emptyDir: {}
                        }
                    ]
                }
            }
        }
    };
}