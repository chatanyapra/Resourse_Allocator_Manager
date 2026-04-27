"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface SettingSection {
  title: string;
  icon: string;
  settings: { label: string; description: string; type: "toggle" | "select"; value?: string; options?: string[] }[];
}

const settingSections: SettingSection[] = [
  {
    title: "General",
    icon: "tune",
    settings: [
      { label: "Dark Mode", description: "Use dark theme across the interface", type: "toggle" },
      { label: "Language", description: "Interface language", type: "select", value: "English", options: ["English", "Spanish", "German", "Japanese"] },
      { label: "Timezone", description: "Display timezone for logs and events", type: "select", value: "UTC", options: ["UTC", "US/Eastern", "US/Pacific", "Europe/London", "Asia/Tokyo"] },
    ],
  },
  {
    title: "Notifications",
    icon: "notifications",
    settings: [
      { label: "Pod Failures", description: "Get alerted when a pod enters a failed state", type: "toggle" },
      { label: "High Resource Usage", description: "Alert when CPU or memory exceeds 90%", type: "toggle" },
      { label: "Deployment Updates", description: "Notify on new deployments and rollbacks", type: "toggle" },
    ],
  },
  {
    title: "Cluster",
    icon: "cloud",
    settings: [
      { label: "Auto-scaling", description: "Enable horizontal pod autoscaler", type: "toggle" },
      { label: "Log Retention", description: "How long to keep system logs", type: "select", value: "30 days", options: ["7 days", "14 days", "30 days", "90 days"] },
      { label: "Metrics Polling", description: "Frequency of metric collection", type: "select", value: "15s", options: ["5s", "15s", "30s", "60s"] },
    ],
  },
];

function Toggle({
  defaultOn = true,
  checked,
  onChange,
  label,
}: {
  defaultOn?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
}) {
  const [localOn, setLocalOn] = useState(defaultOn);
  const on = checked ?? localOn;

  const handleClick = () => {
    const next = !on;
    if (onChange) {
      onChange(next);
      return;
    }

    setLocalOn(next);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
        on ? "bg-primary-container" : "bg-surface-container-highest"
      }`}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { isDark, setTheme } = useTheme();

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-on-surface tracking-tight">Settings</h2>
        <p className="text-on-surface-variant text-sm mt-1">Manage your cluster configuration and preferences.</p>
      </div>

      <div className="space-y-8 max-w-3xl">
        {settingSections.map((section, si) => (
          <div
            key={section.title}
            className="bg-surface-container rounded-xl p-8 animate-fade-in-up"
            style={{ animationDelay: `${si * 0.05}s` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">{section.icon}</span>
              <h3 className="font-bold text-white uppercase text-xs tracking-widest">{section.title}</h3>
            </div>

            <div className="space-y-5">
              {section.settings.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{setting.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{setting.description}</p>
                  </div>
                  {setting.type === "toggle" ? (
                    <Toggle
                      label={setting.label}
                      checked={setting.label === "Dark Mode" ? isDark : undefined}
                      onChange={
                        setting.label === "Dark Mode"
                          ? (checked) => setTheme(checked ? "dark" : "light")
                          : undefined
                      }
                    />
                  ) : (
                    <select
                      className="bg-surface-container-highest border-none rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-primary-container/50 cursor-pointer"
                      defaultValue={setting.value}
                    >
                      {setting.options?.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="bg-surface-container rounded-xl p-8 border border-error/20 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-error">warning</span>
            <h3 className="font-bold text-error uppercase text-xs tracking-widest">Danger Zone</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Reset Cluster Configuration</p>
              <p className="text-[10px] text-slate-500 mt-0.5">This will reset all settings to their default values.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-error/15 text-error text-[10px] font-bold uppercase tracking-widest hover:bg-error/25 transition-colors cursor-pointer">
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
