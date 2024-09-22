"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { products } from "@/server/schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";

const actionClient = createSafeActionClient();

export const getProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (!product) return { error: `No product not found with id ${id}` };
      return { success: product };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
