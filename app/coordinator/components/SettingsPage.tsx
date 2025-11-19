import SettingsTabs from "./SettingsTabs";
import SchoolInformation from "./SchoolInformation";
import CoordinatorInformation from "./CoordinatorInformation";
import UpdatePassword from "./UpdatePassword";
import { Settings } from "lucide-react";
import type { UserData } from "@/types/user";
import type { SchoolData } from "@/types/school";

interface SettingsPageProps {
  activeTab: string;
  userData: UserData;
  schoolData: SchoolData;
}

export default function SettingsPage({
  activeTab,
  userData,
  schoolData,
}: SettingsPageProps) {
  const tabs = [
    { id: "school-information", label: "School Information" },
    { id: "coordinator-information", label: "Coordinator's Information" },
    { id: "update-password", label: "Update Password" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400 mt-1">
                Manage your school and account information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-slate-800 rounded-xl border border-slate-700 p-6">
              <SettingsTabs tabs={tabs} activeTab={activeTab} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
              {activeTab === "school-information" && (
                <SchoolInformation schoolData={schoolData} />
              )}
              {activeTab === "coordinator-information" && (
                <CoordinatorInformation userData={userData} />
              )}
              {activeTab === "update-password" && <UpdatePassword />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
