"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function TopBar() {
  const { user, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const displayName = user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header
      id="topbar"
      className="fixed top-0 w-[calc(100%-16rem)] z-40 flex justify-between items-center px-8 py-3 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_25px_50px_-12px_rgba(30,64,175,0.15)]"
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            search
          </span>
          <input
            id="search-input"
            className="w-full bg-white/5 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 transition-all outline-none focus:ring-1 focus:ring-blue-500/50"
            placeholder="Search resources, pods, or nodes..."
            type="text"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            id="btn-notifications"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-all cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            <span className="material-symbols-outlined">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/10" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-xs font-bold text-white tracking-tight">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-500">
              {isAdmin ? "Root Admin" : "Member"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-white border border-white/10">
            {initials}
          </div>
          <button
            id="btn-logout"
            onClick={logout}
            className="p-2 text-slate-500 hover:text-error hover:bg-error/10 rounded-full transition-all cursor-pointer"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
