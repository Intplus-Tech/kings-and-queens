"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Tab {
  id: string;
  label: string;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
}

export default function SettingsTabs({ tabs, activeTab }: SettingsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.push(`?${params.toString()}`);
  };

  return (
    <nav className="space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeTab === tab.id
            ? "bg-yellow-400 text-transparent bg-clip-text font-medium"
            : "text-gray-300 hover:text-white hover:bg-[#3C3C3E]"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}