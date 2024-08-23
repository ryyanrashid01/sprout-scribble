"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/auth/new-verfication?token=${token}`;

  const {} = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sprout & Scribble - Confirmation Email",
    html: `<p>Click to <a href='${confirmationLink}'> confirm your email </a></p>`,
  });
};
