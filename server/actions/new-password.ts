"use server";

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/server/schema";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);
    if (!token) {
      return { error: "Token is required" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token is invalid" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ password: hashedpassword })
        .where(eq(users.email, existingToken.email));
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token));
    });

    return { success: "Password updated" };
  });
