"use client";

interface ActivityItem {
  id: string;
  name: string;
  ip: string;
  region: string;
  icon: string;
  iconColor: string;
  status: string;
  statusColor: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "activity-1",
    name: "api-gateway-v2",
    ip: "10.0.4.12",
    region: "us-east-1",
    icon: "deployed_code",
    iconColor: "text-green-400",
    status: "Healthy",
    statusColor: "text-green-500",
    time: "2m ago",
  },
  {
    id: "activity-2",
    name: "worker-node-88",
    ip: "10.0.9.45",
    region: "eu-west-2",
    icon: "terminal",
    iconColor: "text-blue-400",
    status: "Pending",
    statusColor: "text-blue-500",
    time: "14m ago",
  },
  {
    id: "activity-3",
    name: "db-replica-03",
    ip: "10.2.1.88",
    region: "us-west-2",
    icon: "database",
    iconColor: "text-error",
    status: "Terminated",
    statusColor: "text-error",
    time: "45m ago",
  },
  {
    id: "activity-4",
    name: "auth-service-pod",
    ip: "10.0.1.55",
    region: "us-east-1",
    icon: "deployed_code",
    iconColor: "text-green-400",
    status: "Healthy",
    statusColor: "text-green-500",
    time: "1h ago",
  },
  {
    id: "activity-5",
    name: "config-sync-01",
    ip: "10.5.5.55",
    region: "global",
    icon: "settings_input_component",
    iconColor: "text-slate-400",
    status: "Offline",
    statusColor: "text-slate-400",
    time: "3h ago",
  },
];

export default function ActivityFeed() {
  return (
    <div
      id="activity-feed"
      className="bg-surface-container rounded-xl p-6 flex-1 animate-fade-in-up"
      style={{ animationDelay: "0.1s" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white uppercase text-xs tracking-widest">
          Recent Activity
        </h3>
        <button
          id="btn-view-all"
          className="text-[10px] text-primary hover:underline font-bold uppercase tracking-tighter cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4 stagger-children">
        {activities.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className="flex items-center gap-4 group hover:bg-surface-container-high/50 rounded-lg p-2 -mx-2 transition-colors duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-white/5">
              <span
                className={`material-symbols-outlined ${item.iconColor} text-lg`}
              >
                {item.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {item.name}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {item.ip} • {item.region}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                className={`text-[10px] font-bold ${item.statusColor} uppercase`}
              >
                {item.status}
              </p>
              <p className="text-[10px] text-slate-600">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
