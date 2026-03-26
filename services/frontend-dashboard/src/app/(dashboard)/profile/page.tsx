export default function ProfilePage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-on-surface tracking-tight">Profile</h2>
        <p className="text-on-surface-variant text-sm mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container rounded-xl p-8 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full gradient-cta mx-auto flex items-center justify-center text-2xl font-black text-white mb-4"
              style={{ boxShadow: "0 8px 24px rgba(50, 108, 229, 0.35)" }}>
              K
            </div>
            <h3 className="text-lg font-bold text-white">KubeLitho Admin</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">root@kubelitho.io</p>
            <p className="text-[10px] text-primary uppercase tracking-widest font-bold mt-2">Root Admin</p>

            <div className="mt-6 pt-6 border-t border-outline-variant/15 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Member since</span>
                <span className="text-slate-300 font-mono">2022-06-15</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last login</span>
                <span className="text-slate-300 font-mono">2 hours ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">API Key</span>
                <span className="text-slate-300 font-mono">••••••••kf9x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Personal Info */}
          <div className="bg-surface-container rounded-xl p-8 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest mb-6">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: "KubeLitho Administrator" },
                { label: "Email", value: "root@kubelitho.io" },
                { label: "Role", value: "Root Admin" },
                { label: "Organization", value: "KubeLitho Inc." },
              ].map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{field.label}</label>
                  <div className="bg-surface-container-highest rounded-lg px-4 py-2.5 text-sm text-slate-200">{field.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-surface-container rounded-xl p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-bold text-white uppercase text-xs tracking-widest mb-6">Permissions & Access</h3>
            <div className="flex flex-wrap gap-2">
              {["cluster:admin", "pods:create", "pods:delete", "nodes:manage", "secrets:read", "namespaces:manage", "rbac:admin", "logs:view"].map((perm) => (
                <span
                  key={perm}
                  className="px-3 py-1.5 rounded-lg bg-primary-container/15 text-primary text-[10px] font-mono font-bold uppercase"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
