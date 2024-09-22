"use server";

import VerifyEmail from "@/components/emails/email-confirmation";
import ResetPasswordEmail from "@/components/emails/reset-password";
import TwoFactorEmail from "@/components/emails/two-factor";
import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/auth/new-verification?token=${token}`;

  const {} = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sprout & Scribble - Confirmation Email",
    react: VerifyEmail({ confirmationLink: confirmationLink }),
  });
};

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const {} = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sprout & Scribble - Password Reset",
    react: ResetPasswordEmail({
      name: name.split(" ")[0],
      resetPasswordLink: resetLink,
    }),
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  const {} = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sprout & Scribble - 2FA Code",
    react: TwoFactorEmail({ twoFactorToken: token }),
  });
};
