"use server";

import { ProductSchema } from "@/types/products-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { products } from "@/server/schema";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currentProduct) return { error: "Product not found" };

        await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id));

        revalidatePath("/dashboard/products");

        return { success: "Product details updated" };
      } else {
        const product = await db
          .insert(products)
          .values({ title, description, price })
          .returning();

        revalidatePath("/dashboard/products");

        return { success: `${product[0].title} added` };
      }
    } catch (error) {
      return { error: "Failed to add product" };
    }
  });
