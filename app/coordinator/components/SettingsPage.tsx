import SettingsTabs from "./SettingsTabs"
import SchoolInformation from "./SchoolInformation"
import CoordinatorInformation from "./CoordinatorInformation"
import UpdatePassword from "./UpdatePassword"
import type { UserData } from "@/types/user"
import type { SchoolData } from "@/types/school"

interface SettingsPageProps {
  activeTab: string
  userData: UserData
  schoolData: SchoolData
}

export default function SettingsPage({ activeTab, userData, schoolData }: SettingsPageProps) {
  const tabs = [
    { id: "school-information", label: "School Information" },
    { id: "coordinator-information", label: "Coordinator's Information" },
    { id: "update-password", label: "Update Password" },
  ]

  return (
    <div className="min-h-screen text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen p-1">
          <SettingsTabs tabs={tabs} activeTab={activeTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-1">
          {activeTab === "school-information" && <SchoolInformation schoolData={schoolData} />}
          {activeTab === "coordinator-information" && <CoordinatorInformation userData={userData} />}
          {activeTab === "update-password" && <UpdatePassword />}
        </div>
      </div>
    </div>
  )
}
