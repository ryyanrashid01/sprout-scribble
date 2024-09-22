import { NewPasswordForm } from "@/components/auth/new-password-form";
import { redirect } from "next/navigation";

export default function NewPassword({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) {
    redirect("/auth/reset");
  }
  return <NewPasswordForm />;
}
