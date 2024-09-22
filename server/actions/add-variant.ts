"use server";

import { VariantSchema } from "@/types/new-variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "@/server/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const actionClient = createSafeActionClient();
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const addVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        id,
        color,
        editMode,
        productType,
        tags,
        variantImages: newImages,
        productId,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, editVariant[0].id));
          await db
            .insert(variantTags)
            .values(tags.map((tag) => ({ tag, variantId: editVariant[0].id })));
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editVariant[0].id));
          await db.insert(variantImages).values(
            newImages.map((image, idx) => ({
              name: image.name,
              size: image.size,
              url: image.url,
              order: idx,
              variantId: editVariant[0].id,
            }))
          );

          client.partialUpdateObject({
            indexName: "products",
            objectID: editVariant[0].id.toString(),
            attributesToUpdate: {
              id: editVariant[0].productId,
              productType: editVariant[0].productType,
              variantImages: newImages[0].url,
            },
          });

          revalidatePath("/dashboard/products");
          return { success: `${productType} updated` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId,
            })
            .returning();
          const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
          });
          await db
            .insert(variantTags)
            .values(tags.map((tag) => ({ tag, variantId: newVariant[0].id })));
          await db.insert(variantImages).values(
            newImages.map((image, idx) => ({
              name: image.name,
              size: image.size,
              url: image.url,
              order: idx,
              variantId: newVariant[0].id,
            }))
          );

          if (product) {
            client.saveObject({
              indexName: "products",
              body: {
                objectID: newVariant[0].id.toString(),
                id: newVariant[0].productId,
                title: product.title,
                price: product.price,
                productType: newVariant[0].productType,
                variantImages: newImages[0].url,
              },
            });
          }

          revalidatePath("/dashboard/products");
          return { success: `${productType} variant added` };
        }
      } catch (error) {
        console.error(error);
        return { error: "Failed to add variant" };
      }
    }
  );
