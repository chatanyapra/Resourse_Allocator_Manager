import {
  StatsGrid,
  TelemetryChart,
  ActivityFeed,
  StatusBanner,
  SystemLogs,
} from "@/components";

export default function DashboardPage() {
  return (
    <>
      {/* Welcome Row */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">
            Fleet Overview
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            System health and resource distribution across 12 active nodes.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              A
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
              M
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">
              +4
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        <TelemetryChart />
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <ActivityFeed />
          <StatusBanner />
        </div>
      </div>

      {/* System Logs */}
      <SystemLogs />
    </>
  );
}
