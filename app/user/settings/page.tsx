import SettingsCard from "@/components/user/settings-card";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return <SettingsCard session={session} />;
}
