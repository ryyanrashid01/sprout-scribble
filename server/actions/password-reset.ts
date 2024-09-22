"use server";

import { ResetSchema } from "@/types/reset-schema";
import { createSafeActionClient } from "next-safe-action";
import { users } from "@/server/schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

const actionClient = createSafeActionClient();

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "Account does not exist" };
    }

    const resetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      existingUser.name!,
      resetToken[0].email,
      resetToken[0].token
    );

    return { success: "Reset email sent" };
  });
