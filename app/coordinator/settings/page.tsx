import { notFound } from "next/navigation";
import { getUser } from "@/lib/actions/user/user.action";
import { getSchoolInfo } from "@/lib/actions/school/schoolManagement.action";
import SettingsPage from "../components/SettingsPage";

interface SettingsPageProps {
  searchParams: { tab?: string };
}

export default async function Settings({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const activeTab = params.tab || "school-information";
  const validTabs = [
    "school-information",
    "coordinator-information",
    "update-password",
  ];

  if (!validTabs.includes(activeTab)) {
    notFound();
  }

  const response = await getUser();
  const schoolResponse = await getSchoolInfo();

  if (!response.success) {
    notFound();
  }

  const userData = response.data;
  const schoolData = schoolResponse.data;

  if (!userData) {
    notFound();
  }

  if (!schoolData) {
    notFound();
  }

  return (
    <SettingsPage
      activeTab={activeTab}
      userData={userData}
      schoolData={schoolData}
    />
  );
}
