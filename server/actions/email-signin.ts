"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "@/server/schema";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import {
  sendPasswordResetEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
} from "./email";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email != email) {
        return { error: "Account does not exist" };
      }

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Confirmation email sent" };
      }

      if (!existingUser?.password) {
        const resetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(
          existingUser.name!,
          resetToken[0].email,
          resetToken[0].token
        );
        return {
          error:
            "Email sign-in is not set up for this account. Check your email.",
        };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
          if (!twoFactorToken) {
            return { error: "Invalid 2FA code" };
          }
          if (twoFactorToken.token !== code) {
            return { error: "Incorrect 2FA code" };
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "Two-factor code has expired" };
          }

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: "Failed to generate 2FA token" };
          }

          await sendTwoFactorEmail(token[0].email, token[0].token);

          return { twoFactor: "2FA code sent to your email" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (err) {
      console.log("Login error: ", err);
      if (err instanceof AuthError) {
        switch (err.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          default:
            return { error: `Something went wrong: ${err.name}` };
        }
      }
      throw err;
    }
  });
