"use client";

const barData = [
  { height: "50%", fill: "60%" },
  { height: "75%", fill: "85%" },
  { height: "66%", fill: "40%" },
  { height: "33%", fill: "90%" },
  { height: "60%", fill: "20%" },
  { height: "80%", fill: "75%" },
  { height: "50%", fill: "55%" },
  { height: "100%", fill: "80%" },
];

const timeLabels = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

export default function TelemetryChart() {
  return (
    <div
      id="telemetry-chart"
      className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl p-8 animate-fade-in-up"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Resource Telemetry
          </h3>
          <p className="text-on-surface-variant text-sm">
            Aggregated CPU and Memory pressure across all clusters
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-primary uppercase cursor-pointer hover:bg-white/10 transition-colors">
            Real-time
          </span>
          <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:bg-white/10 hover:text-slate-300 transition-colors">
            History
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 flex items-end justify-between gap-1 relative pt-10">
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-x-0 top-10 border-t border-white/5 h-0" />
        <div className="absolute inset-x-0 top-1/2 border-t border-white/5 h-0" />
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 h-0" />

        {/* Bars */}
        <div className="w-full flex items-end justify-around h-full group">
          {barData.map((bar, i) => (
            <div
              key={i}
              className="w-8 bg-primary-container/20 rounded-t-sm relative group-hover:bg-primary-container/40 transition-all duration-300 cursor-pointer"
              style={{ height: bar.height }}
            >
              <div
                className="absolute bottom-0 inset-x-0 bg-primary-container rounded-t-sm transition-all duration-500"
                style={{ height: bar.fill }}
              />
              {/* Tooltip (appears on hover if needed) */}
            </div>
          ))}
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        {timeLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
