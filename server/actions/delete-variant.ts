"use server";

import * as z from "zod";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const actionClient = createSafeActionClient();
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      client.deleteObject({
        indexName: "products",
        objectID: deletedVariant[0].id.toString(),
      });

      revalidatePath("/dashboard/products");
      return { success: `${deletedVariant[0].productType} variant removed` };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong. Variant could not be deleted." };
    }
  });
