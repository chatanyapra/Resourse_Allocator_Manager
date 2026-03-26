"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePodPage() {
  const [cpuValue, setCpuValue] = useState(512);
  const [memoryValue, setMemoryValue] = useState(1024);
  const [registryPath, setRegistryPath] = useState(
    "docker.io/kubeflow/node-exporter:v1.3.1"
  );
  const [port, setPort] = useState("8080");

  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-primary-container" />
          <span className="text-primary-container text-xs font-bold tracking-[0.2em] uppercase">
            Provisioning Engine
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tighter mb-4">
              Deploy New Workload
            </h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Configure and instantiate a new container pod within the{" "}
              <span className="text-primary font-mono">us-east-1-prod</span>{" "}
              cluster environment. Ensure resource limits align with namespace
              quotas.
            </p>
          </div>
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {/* Container Image Section */}
          <section className="bg-surface-container rounded-xl p-8 border border-outline-variant/10 relative overflow-hidden group animate-fade-in-up">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">
                upload_file
              </span>
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                layers
              </span>
              Container Image
            </h3>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center transition-all duration-300 hover:border-primary-container hover:bg-primary-container/5 group/dropzone cursor-pointer">
              <div className="mb-4">
                <span className="material-symbols-outlined text-5xl text-outline mb-2 transition-transform duration-300 group-hover/dropzone:-translate-y-2">
                  cloud_upload
                </span>
              </div>
              <p className="text-on-surface font-medium mb-1">
                Drag and drop Docker manifest or image
              </p>
              <p className="text-on-surface-variant text-sm mb-6">
                Supports .tar, .json, or OCI-compliant formats
              </p>
              <button className="px-6 py-2 bg-surface-container-highest border border-outline-variant rounded-lg text-sm font-bold hover:bg-surface-bright transition-colors cursor-pointer">
                Browse Registry
              </button>
            </div>

            {/* Manual Registry Path */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Manual Registry Path
                </label>
                <div className="bg-surface-container-lowest rounded-lg p-3 border-b-2 border-outline-variant focus-within:border-primary transition-all">
                  <input
                    className="w-full bg-transparent border-none p-0 text-primary font-mono text-sm outline-none"
                    type="text"
                    value={registryPath}
                    onChange={(e) => setRegistryPath(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-32">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Port
                </label>
                <div className="bg-surface-container-lowest rounded-lg p-3 border-b-2 border-outline-variant focus-within:border-primary transition-all">
                  <input
                    className="w-full bg-transparent border-none p-0 text-on-surface font-mono text-sm outline-none"
                    placeholder="8080"
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Resource Constraints */}
          <section
            className="bg-surface-container rounded-xl p-8 border border-outline-variant/10 animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                memory
              </span>
              Resource Constraints
            </h3>
            <div className="space-y-12">
              {/* CPU Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-on-surface">
                      CPU Millicores
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Allocated processing power (m)
                    </p>
                  </div>
                  <span className="text-2xl font-black text-primary font-mono tracking-tighter">
                    {cpuValue}
                    <span className="text-xs ml-1 text-on-surface-variant uppercase">
                      m
                    </span>
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary-container"
                  type="range"
                  min={128}
                  max={4096}
                  value={cpuValue}
                  onChange={(e) => setCpuValue(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-outline font-bold uppercase">
                  <span>128m (Burst)</span>
                  <span>4096m (Max)</span>
                </div>
              </div>

              {/* Memory Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-on-surface">
                      Memory Allocation
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Reserved system RAM (MB)
                    </p>
                  </div>
                  <span className="text-2xl font-black text-primary font-mono tracking-tighter">
                    {memoryValue}
                    <span className="text-xs ml-1 text-on-surface-variant uppercase">
                      mb
                    </span>
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary-container"
                  type="range"
                  min={256}
                  max={16384}
                  value={memoryValue}
                  onChange={(e) => setMemoryValue(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-outline font-bold uppercase">
                  <span>256mb</span>
                  <span>16gb limit</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Preview & Deploy */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <section
            className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 flex flex-col animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="p-6 border-b border-surface-container-highest bg-surface-container-high/50">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  visibility
                </span>
                Instance Insight
              </h3>
            </div>
            <div className="flex-1 p-8 flex flex-col">
              {/* Image Preview */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 group cursor-crosshair bg-surface-container-lowest">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 via-surface-container/50 to-inverse-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary/30"
                    style={{ fontSize: "96px" }}
                  >
                    deployed_code
                  </span>
                </div>
                {/* Scan Line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40 animate-pulse"
                  style={{ boxShadow: "0 0 15px rgba(50,108,229,0.8)" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                      style={{ boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">
                      Active Schema Scan
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-white drop-shadow-md italic">
                    IMAGE_RECOGNITION_PASS
                  </h4>
                </div>
              </div>

              {/* Verification Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified_user
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Visual Signature
                    </span>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant">
                    99.4% Match
                  </span>
                </div>
                <div className="p-4 bg-surface-container-highest/30 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                      Layer Consistency
                    </span>
                    <span className="text-[10px] font-bold text-primary">
                      OPTIMAL
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1 flex-1 bg-primary-container rounded-full" />
                    <div className="h-1 flex-1 bg-primary-container rounded-full" />
                    <div className="h-1 flex-1 bg-primary-container rounded-full" />
                    <div className="h-1 flex-1 bg-primary-container/30 rounded-full" />
                    <div className="h-1 flex-1 bg-primary-container/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Deploy CTA */}
              <div className="mt-auto pt-8">
                <button
                  id="btn-deploy-pod"
                  className="w-full py-5 gradient-cta rounded-xl text-white font-black text-lg tracking-tight hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                  style={{ boxShadow: "0 20px 40px rgba(50, 108, 229, 0.3)" }}
                >
                  <span className="material-symbols-outlined">
                    rocket_launch
                  </span>
                  DEPLOY POD
                </button>
                <p className="text-center mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
                  Estimated Deployment: 14.2s
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 stagger-children"
      >
        {[
          { label: "Current Load", value: "12.4%", color: "text-on-surface" },
          { label: "Queue Status", value: "IDLE", color: "text-on-surface" },
          { label: "Nodes Active", value: "42/42", color: "text-on-surface" },
          { label: "System Health", value: "99.9%", color: "text-green-500" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="animate-fade-in-up bg-surface-container-low p-4 rounded-lg border border-outline-variant/5"
          >
            <p className="text-[10px] font-bold uppercase text-outline tracking-widest mb-1">
              {metric.label}
            </p>
            <p className={`text-2xl font-black ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
