"use client";

export default function StatusBanner() {
  return (
    <div
      id="status-banner"
      className="gradient-cta rounded-xl p-6 text-white relative overflow-hidden animate-fade-in-up"
      style={{
        animationDelay: "0.15s",
        boxShadow: "0 20px 40px rgba(50, 108, 229, 0.25)",
      }}
    >
      <div className="relative z-10">
        <h4 className="text-lg font-black uppercase tracking-tighter mb-2 italic">
          Litho Optimized
        </h4>
        <p className="text-sm opacity-90 mb-4 leading-relaxed">
          System is running at 94% efficiency. No critical bottleneck detected
          in the orchestration layer.
        </p>
        <button
          id="btn-run-diagnostics"
          className="bg-white text-primary-container px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 transition-transform"
        >
          Run Diagnostics
        </button>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-20">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "128px" }}
        >
          auto_awesome
        </span>
      </div>
    </div>
  );
}
