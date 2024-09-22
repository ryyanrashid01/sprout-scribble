import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  if (session.user.role === "admin") {
    redirect("/dashboard/analytics");
  }
  redirect("/dashboard/orders");
}
