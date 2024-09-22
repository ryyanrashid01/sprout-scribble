import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
    return;
  }
  return <LoginForm />;
}
