"use client";

interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  borderColor: string;
  badge?: {
    text: string;
    color: string;
  };
  signal?: {
    color: string;
    glow: boolean;
    pulse?: boolean;
  };
}

const stats: StatCard[] = [
  {
    id: "stat-total-pods",
    label: "Total Pods",
    value: "1,284",
    icon: "hub",
    borderColor: "border-l-primary-container",
    badge: { text: "+12.4%", color: "text-green-400" },
  },
  {
    id: "stat-running",
    label: "Running",
    value: "1,240",
    icon: "check_circle",
    borderColor: "border-l-green-500/50",
    signal: { color: "bg-green-500", glow: true },
  },
  {
    id: "stat-pending",
    label: "Pending",
    value: "38",
    icon: "pending",
    borderColor: "border-l-tertiary-container",
    badge: { text: "Queue High", color: "text-tertiary-container" },
  },
  {
    id: "stat-failed",
    label: "Failed",
    value: "6",
    icon: "error",
    borderColor: "border-l-error",
    signal: { color: "bg-error", glow: true, pulse: true },
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
      {stats.map((stat) => (
        <div
          key={stat.id}
          id={stat.id}
          className={`animate-fade-in-up bg-surface-container rounded-xl p-6 border-l-4 ${stat.borderColor} relative overflow-hidden group hover:bg-surface-container-high transition-colors duration-300`}
        >
          {/* Background icon */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <span className="material-symbols-outlined text-4xl">
              {stat.icon}
            </span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {stat.label}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stat.value}</span>

            {stat.badge && (
              <span className={`text-xs font-mono ${stat.badge.color}`}>
                {stat.badge.text}
              </span>
            )}

            {stat.signal && (
              <div
                className={`w-2 h-2 rounded-full ${stat.signal.color} ${
                  stat.signal.pulse ? "animate-pulse" : ""
                }`}
                style={
                  stat.signal.glow
                    ? {
                        boxShadow: `0 0 8px ${
                          stat.signal.color.includes("green")
                            ? "rgba(34, 197, 94, 0.6)"
                            : "rgba(255, 180, 171, 0.6)"
                        }`,
                      }
                    : undefined
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
