"use client";

import { useState } from "react";
import Link from "next/link";

interface Allocation {
  id: string;
  name: string;
  namespace: string;
  node: string;
  cpu: string;
  memory: string;
  status: "Running" | "Pending" | "Terminated" | "CrashLoopBackOff";
  restarts: number;
  age: string;
}

const allocations: Allocation[] = [
  { id: "pod-001", name: "api-gateway-v2", namespace: "prod", node: "kube-node-01", cpu: "250m", memory: "512Mi", status: "Running", restarts: 0, age: "4d" },
  { id: "pod-002", name: "auth-service-pod", namespace: "prod", node: "kube-node-01", cpu: "100m", memory: "256Mi", status: "Running", restarts: 0, age: "7d" },
  { id: "pod-003", name: "worker-node-88", namespace: "batch", node: "kube-node-03", cpu: "500m", memory: "1Gi", status: "Pending", restarts: 0, age: "14m" },
  { id: "pod-004", name: "db-replica-03", namespace: "data", node: "kube-node-02", cpu: "1000m", memory: "2Gi", status: "Terminated", restarts: 3, age: "2d" },
  { id: "pod-005", name: "config-sync-01", namespace: "system", node: "kube-node-04", cpu: "50m", memory: "128Mi", status: "CrashLoopBackOff", restarts: 12, age: "1d" },
  { id: "pod-006", name: "metrics-collector", namespace: "monitoring", node: "kube-node-02", cpu: "200m", memory: "384Mi", status: "Running", restarts: 0, age: "12d" },
  { id: "pod-007", name: "ingress-nginx-ctrl", namespace: "ingress", node: "kube-node-01", cpu: "300m", memory: "512Mi", status: "Running", restarts: 1, age: "30d" },
  { id: "pod-008", name: "redis-cache-primary", namespace: "data", node: "kube-node-03", cpu: "150m", memory: "1Gi", status: "Running", restarts: 0, age: "15d" },
  { id: "pod-009", name: "cronjob-cleanup-xk2", namespace: "batch", node: "kube-node-04", cpu: "100m", memory: "256Mi", status: "Pending", restarts: 0, age: "3m" },
  { id: "pod-010", name: "frontend-ssr-v3", namespace: "prod", node: "kube-node-01", cpu: "400m", memory: "768Mi", status: "Running", restarts: 0, age: "1d" },
];

const statusStyles: Record<string, string> = {
  Running: "text-green-500",
  Pending: "text-blue-400",
  Terminated: "text-error",
  CrashLoopBackOff: "text-tertiary-container",
};

const statusDotStyles: Record<string, string> = {
  Running: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  Pending: "bg-blue-400 animate-pulse",
  Terminated: "bg-error/50",
  CrashLoopBackOff: "bg-tertiary-container animate-pulse",
};

export default function AllocationsPage() {
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? allocations : allocations.filter((a) => a.status === filter);

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Pod Allocations</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            All active and recent pod allocations across the cluster.
          </p>
        </div>
        <Link href="/create-pod" className="gradient-cta text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          style={{ boxShadow: "0 8px 24px rgba(50, 108, 229, 0.3)" }}>
          <span className="material-symbols-outlined text-sm">add</span>
          New Allocation
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["All", "Running", "Pending", "Terminated", "CrashLoopBackOff"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
              filter === f
                ? "bg-primary-container text-white"
                : "bg-surface-container-high text-slate-400 hover:bg-surface-container-highest hover:text-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-xl overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pod Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Namespace</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Node</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">CPU</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Memory</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Restarts</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Age</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pod, i) => (
                <tr
                  key={pod.id}
                  className={`border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors cursor-pointer ${
                    i % 2 === 0 ? "bg-surface-container" : "bg-surface-container-low"
                  }`}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-primary text-sm">deployed_code</span>
                      </div>
                      <span className="text-xs font-bold text-slate-200">{pod.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs font-mono text-slate-400">{pod.namespace}</td>
                  <td className="px-6 py-3.5 text-xs font-mono text-slate-400">{pod.node}</td>
                  <td className="px-6 py-3.5 text-xs font-mono text-slate-300">{pod.cpu}</td>
                  <td className="px-6 py-3.5 text-xs font-mono text-slate-300">{pod.memory}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDotStyles[pod.status]}`} />
                      <span className={`text-[10px] font-bold uppercase ${statusStyles[pod.status]}`}>{pod.status}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-3.5 text-xs font-mono ${pod.restarts > 5 ? "text-error" : "text-slate-400"}`}>{pod.restarts}</td>
                  <td className="px-6 py-3.5 text-xs font-mono text-slate-500">{pod.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-[10px] text-slate-500 font-mono">
          Showing {filtered.length} of {allocations.length} pods
        </p>
        <p className="text-[10px] text-slate-600 font-mono">
          Last synced 12s ago
        </p>
      </div>
    </>
  );
}
