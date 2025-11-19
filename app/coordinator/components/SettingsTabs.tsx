"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Building2, User, Lock } from "lucide-react";

interface Tab {
  id: string;
  label: string;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
}

const tabIcons: Record<string, React.ComponentType<{ className: string }>> = {
  "school-information": Building2,
  "coordinator-information": User,
  "update-password": Lock,
};

export default function SettingsTabs({ tabs, activeTab }: SettingsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.push(`?${params.toString()}`);
  };

  return (
    <nav className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold px-3 mb-4">
        Settings
      </p>
      {tabs.map((tab) => {
        const Icon = tabIcons[tab.id];
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
