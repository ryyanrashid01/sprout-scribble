import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/server/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type VariantsWithImagesTags = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true }
>;

export type ProductsWithVariants = InferResultType<
  "products",
  { productVariants: true }
>;

export type VariantsWithImagesTagsProduct = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true; product: true }
>;

export type ReviewsWithUser = InferResultType<
  "reviews",
  {
    user: true;
  }
>;

export type TotalOrders = InferResultType<
  "orderProduct",
  {
    order: { with: { user: true } };
    product: true;
    variant: {
      with: { variantImages: true };
    };
  }
>;

export type UserOrders = InferResultType<
  "orders",
  {
    orderProduct: {
      with: {
        order: true;
        variant: { with: { variantImages: true } };
        product: true;
      };
    };
  }
>;

export type UserOrdersWithShipping = InferResultType<
  "orders",
  {
    orderProduct: {
      with: {
        order: true;
        variant: { with: { variantImages: true } };
        product: true;
      };
    };
    shippingAddress: true;
  }
>;

export type OrderShipping = InferResultType<"shippingAddresses">;
