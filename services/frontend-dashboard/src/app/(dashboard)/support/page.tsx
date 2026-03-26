export default function SupportPage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-on-surface tracking-tight">Support</h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Get help, browse documentation, or contact the KubeLitho team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 stagger-children">
        {[
          {
            icon: "menu_book",
            title: "Documentation",
            description: "Browse guides, API references, and tutorials for KubeLitho.",
            cta: "Open Docs",
          },
          {
            icon: "forum",
            title: "Community",
            description: "Join discussions, share knowledge, and get help from the community.",
            cta: "Join Forum",
          },
          {
            icon: "bug_report",
            title: "Report an Issue",
            description: "Found a bug? Report it so we can fix it in the next release.",
            cta: "File Report",
          },
          {
            icon: "live_help",
            title: "FAQ",
            description: "Answers to frequently asked questions about pod allocation and management.",
            cta: "View FAQ",
          },
          {
            icon: "support_agent",
            title: "Contact Support",
            description: "Reach our support team for priority assistance with your cluster.",
            cta: "Email Us",
          },
          {
            icon: "update",
            title: "Release Notes",
            description: "See what's new in v1.28.4-stable and previous releases.",
            cta: "View Notes",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="animate-fade-in-up bg-surface-container rounded-xl p-6 group hover:bg-surface-container-high transition-colors duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center mb-4 group-hover:bg-primary-container/25 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">{card.icon}</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{card.description}</p>
            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">
              {card.cta} →
            </button>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="bg-surface-container rounded-xl p-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="font-bold text-white uppercase text-xs tracking-widest mb-6">System Information</h3>
        <div className="space-y-3 font-mono text-xs">
          {[
            ["Version", "v1.28.4-stable"],
            ["Build", "2023-10-27T14:00:00Z"],
            ["Kubernetes Version", "v1.28.3"],
            ["Container Runtime", "containerd://1.7.7"],
            ["OS", "Ubuntu 22.04.3 LTS"],
            ["Architecture", "amd64"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-slate-500">{label}</span>
              <span className="text-slate-300">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
