"use client";

interface LogEntry {
  level: "INFO" | "WAIT" | "WARN" | "SYS";
  timestamp: string;
  message: string;
  active?: boolean;
}

const logEntries: LogEntry[] = [
  {
    level: "INFO",
    timestamp: "2023-10-27 14:02:11",
    message: "Cluster connectivity established.",
  },
  {
    level: "INFO",
    timestamp: "2023-10-27 14:02:15",
    message: "Polling pod states across 4 regions...",
  },
  {
    level: "WAIT",
    timestamp: "2023-10-27 14:03:01",
    message: "Synchronizing configuration for namespace 'prod-west'",
  },
  {
    level: "WARN",
    timestamp: "2023-10-27 14:04:22",
    message: "Node 'kube-node-04' reporting high I/O wait (45ms)",
  },
  {
    level: "INFO",
    timestamp: "2023-10-27 14:05:00",
    message: "Metric collection complete. 0 errors found.",
  },
  {
    level: "SYS",
    timestamp: "2023-10-27 14:05:45",
    message: "Listening for new allocation requests...",
    active: true,
  },
];

const levelColors: Record<string, string> = {
  INFO: "text-green-500",
  WAIT: "text-blue-400",
  WARN: "text-tertiary-container",
  SYS: "text-primary-container",
};

export default function SystemLogs() {
  return (
    <div
      id="system-logs"
      className="mt-8 bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden animate-fade-in-up"
      style={{
        animationDelay: "0.2s",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Terminal Header */}
      <div className="bg-surface-container-high px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-error/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="ml-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            Live System Logs
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          TTY: /dev/pts/0
        </span>
      </div>

      {/* Log Content */}
      <div
        className="p-4 h-40 font-mono text-xs overflow-y-auto space-y-1"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {logEntries.map((entry, i) => (
          <p
            key={i}
            className={`text-slate-500 ${
              entry.active ? "text-slate-200 animate-pulse" : ""
            }`}
          >
            <span className={levelColors[entry.level]}>
              [{entry.level}]
            </span>{" "}
            {entry.timestamp} - {entry.message}
            {entry.active && (
              <span className="animate-terminal-blink"> _</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
