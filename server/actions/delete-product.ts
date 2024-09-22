"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { products } from "@/server/schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");

      return { success: `Product ${deletedProduct[0].title} has been removed` };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
