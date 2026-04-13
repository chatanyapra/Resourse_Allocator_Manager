"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { podApi, type PodAllocation } from "@/lib/api";
import DeploymentLogsViewer from "@/components/LogsViewer";

const statusDotColor: Record<string, string> = {
  RUNNING: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
  DEPLOYING: "bg-blue-400 animate-pulse",
  PENDING: "bg-blue-400 animate-pulse",
  FAILED: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  DELETED: "bg-slate-600",
};

const statusTextColor: Record<string, string> = {
  RUNNING: "text-emerald-400",
  DEPLOYING: "text-blue-400",
  PENDING: "text-blue-400",
  FAILED: "text-red-400",
  DELETED: "text-slate-500",
};

/* ── Inner component that uses useSearchParams ── */
function DeploymentsContent() {
  const { isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const queryApp = searchParams.get("app");
  const [pods, setPods] = useState<PodAllocation[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(queryApp);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPods = useCallback(async () => {
    try {
      setError("");
      const data = isAdmin
        ? await podApi.getAllPods()
        : await podApi.getUserPods();
      const active = (data.pods || []).filter((p) => p.status !== "DELETED");
      setPods(active);

      // Auto-select the first pod if nothing is selected
      if (!selectedApp && active.length > 0) {
        setSelectedApp(active[0].appName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pods");
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, selectedApp]);

  useEffect(() => {
    fetchPods();
  }, [fetchPods]);

  // If queryApp changes (e.g. navigating from allocations), update selection
  useEffect(() => {
    if (queryApp) {
      setSelectedApp(queryApp);
    }
  }, [queryApp]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">
            Deployment Logs
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Real-time logs and status for your deployments
          </p>
        </div>
        <button
          onClick={fetchPods}
          className="px-4 py-2.5 bg-surface-container-high text-slate-300 font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-surface-container-highest transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-center gap-3 shrink-0">
          <span className="material-symbols-outlined">error</span>
          {error}
          <button
            onClick={fetchPods}
            className="ml-auto text-xs uppercase tracking-widest font-bold hover:underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-surface-container rounded-xl">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-3">
              progress_activity
            </span>
            <p className="text-sm text-on-surface-variant">
              Loading deployments…
            </p>
          </div>
        </div>
      ) : pods.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-surface-container rounded-xl">
          <div className="text-center">
            <span
              className="material-symbols-outlined text-outline mb-4 block"
              style={{ fontSize: "64px" }}
            >
              deployed_code
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              No Active Deployments
            </h3>
            <p className="text-sm text-on-surface-variant">
              Deploy a pod to see real-time logs here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Sidebar — App selector */}
          <div className="w-72 shrink-0 bg-surface-container rounded-xl border border-outline-variant/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: "16px" }}
                >
                  apps
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Deployments
                </span>
                <span className="ml-auto text-[10px] font-mono text-slate-600">
                  {pods.length}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {pods.map((pod) => {
                const isActive = selectedApp === pod.appName;
                return (
                  <button
                    key={pod.id}
                    onClick={() => setSelectedApp(pod.appName)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-surface-container-high border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          statusDotColor[pod.status] || "bg-slate-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isActive ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {pod.appName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              statusTextColor[pod.status] || "text-slate-500"
                            }`}
                          >
                            {pod.status}
                          </span>
                          <span className="text-[9px] text-slate-600 font-mono">
                            {pod.image}
                          </span>
                        </div>
                      </div>
                      {isActive && (
                        <span
                          className="material-symbols-outlined text-primary shrink-0"
                          style={{ fontSize: "14px" }}
                        >
                          chevron_right
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main — Log viewer */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            {selectedApp ? (
              <DeploymentLogsViewer key={selectedApp} appName={selectedApp} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-surface-container rounded-xl border border-outline-variant/10">
                <div className="text-center">
                  <span
                    className="material-symbols-outlined text-slate-700 mb-3 block"
                    style={{ fontSize: "48px" }}
                  >
                    arrow_back
                  </span>
                  <p className="text-sm text-slate-500">
                    Select a deployment to view logs
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page wrapper with Suspense boundary (required for useSearchParams) ── */
export default function DeploymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-3">
              progress_activity
            </span>
            <p className="text-sm text-on-surface-variant">Loading…</p>
          </div>
        </div>
      }
    >
      <DeploymentsContent />
    </Suspense>
  );
}
