"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { reviews } from "@/server/schema";

const actionClient = createSafeActionClient();

export const deleteReview = actionClient
  .schema(z.object({ id: z.number(), productId: z.number() }))
  .action(async ({ parsedInput: { id, productId } }) => {
    try {
      await db.delete(reviews).where(eq(reviews.id, id));

      revalidatePath(`/products/${productId}`);

      return { success: "Your review has been removed" };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
