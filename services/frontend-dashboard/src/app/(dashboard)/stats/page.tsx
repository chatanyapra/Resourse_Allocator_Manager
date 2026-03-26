"use client";

const clusterMetrics = [
  { label: "Cluster Uptime", value: "99.97%", icon: "timer", trend: "+0.02%", trendColor: "text-green-400" },
  { label: "Avg. CPU Usage", value: "62%", icon: "speed", trend: "-3.1%", trendColor: "text-green-400" },
  { label: "Avg. Memory", value: "74%", icon: "memory", trend: "+1.8%", trendColor: "text-tertiary-container" },
  { label: "Network I/O", value: "1.4 Gbps", icon: "network_check", trend: "+12%", trendColor: "text-blue-400" },
  { label: "Disk IOPS", value: "8,240", icon: "storage", trend: "-5%", trendColor: "text-green-400" },
  { label: "Active Namespaces", value: "24", icon: "folder_managed", trend: "+2", trendColor: "text-blue-400" },
];

const nodeHealth = [
  { name: "kube-node-01", region: "us-east-1", cpu: 72, memory: 65, pods: 42, status: "Healthy" },
  { name: "kube-node-02", region: "us-west-2", cpu: 88, memory: 91, pods: 38, status: "Warning" },
  { name: "kube-node-03", region: "eu-west-2", cpu: 45, memory: 52, pods: 28, status: "Healthy" },
  { name: "kube-node-04", region: "global", cpu: 93, memory: 87, pods: 31, status: "Critical" },
];

const nodeStatusColors: Record<string, string> = {
  Healthy: "text-green-500",
  Warning: "text-tertiary-container",
  Critical: "text-error",
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function StatsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-on-surface tracking-tight">Cluster Statistics</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Real-time performance metrics and resource utilization across all nodes.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 stagger-children">
        {clusterMetrics.map((metric) => (
          <div
            key={metric.label}
            className="animate-fade-in-up bg-surface-container rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container-high transition-colors duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl">{metric.icon}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">{metric.value}</span>
              <span className={`text-xs font-mono ${metric.trendColor}`}>{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Node Health */}
      <h3 className="text-xl font-bold text-white tracking-tight mb-6">Node Health</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nodeHealth.map((node) => (
          <div key={node.name} className="bg-surface-container rounded-xl p-6 animate-fade-in-up hover:bg-surface-container-high transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-slate-200">{node.name}</p>
                <p className="text-[10px] font-mono text-slate-500">{node.region} • {node.pods} pods</p>
              </div>
              <span className={`text-[10px] font-bold uppercase ${nodeStatusColors[node.status]}`}>{node.status}</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400 uppercase tracking-widest font-bold">CPU</span>
                  <span className="text-slate-300 font-mono">{node.cpu}%</span>
                </div>
                <ProgressBar value={node.cpu} color={node.cpu > 85 ? "bg-error" : node.cpu > 70 ? "bg-tertiary-container" : "bg-primary-container"} />
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400 uppercase tracking-widest font-bold">Memory</span>
                  <span className="text-slate-300 font-mono">{node.memory}%</span>
                </div>
                <ProgressBar value={node.memory} color={node.memory > 85 ? "bg-error" : node.memory > 70 ? "bg-tertiary-container" : "bg-primary-container"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
