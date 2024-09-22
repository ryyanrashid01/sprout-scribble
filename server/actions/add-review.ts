"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import { ReviewSchema } from "@/types/review-schema";
import { and, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .schema(ReviewSchema)
  .action(async ({ parsedInput: { productId, comment, rating } }) => {
    try {
      const session = await auth();

      if (!session) return { error: "Please sign in first" };

      const existingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        ),
      });

      if (existingReview)
        return { error: "You have already reviewed this product" };

      const newReview = await db
        .insert(reviews)
        .values({
          productId,
          rating,
          comment,
          userId: session.user.id,
        })
        .returning();

      revalidatePath(`/dashboard/products/${productId}`);

      return { success: "Review added" };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
