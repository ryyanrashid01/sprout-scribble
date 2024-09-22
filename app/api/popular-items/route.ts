import { NextResponse } from "next/server";
import { db } from "@/server";
import {
  orderProduct,
  orders,
  products,
  productVariants,
  variantImages,
} from "@/server/schema";
import { desc, eq, gt, sql } from "drizzle-orm";
import getTimeframeCondition from "@/lib/time-frame";

export async function POST(req: Request) {
  try {
    const { timeframe } = await req.json();

    const startDate = getTimeframeCondition(timeframe);

    const popularItemsWithDetails = await db
      .select({
        created: orders.created,
        productId: orderProduct.productId,
        productVariantId: orderProduct.productVariantId,
        totalQuantity: sql<number>`SUM(${orderProduct.quantity})`.as(
          "totalQuantity"
        ),
        productName: products.title,
        productPrice: products.price,
        variantName: productVariants.productType,
        variantImages: sql<string[]>`array_agg(${variantImages.url})`.as(
          "variantImages"
        ),
      })
      .from(orderProduct)
      .leftJoin(orders, eq(orderProduct.orderId, orders.id))
      .leftJoin(products, eq(orderProduct.productId, products.id))
      .leftJoin(
        productVariants,
        eq(orderProduct.productVariantId, productVariants.id)
      )
      .leftJoin(variantImages, eq(productVariants.id, variantImages.variantId))
      .where(gt(orders.created, startDate))
      .groupBy(
        orders.created,
        orderProduct.productId,
        orderProduct.productVariantId,
        products.title,
        productVariants.productType,
        products.price
      )
      .orderBy(desc(sql`SUM(${orderProduct.quantity})`))
      .limit(10);

    return NextResponse.json(popularItemsWithDetails);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
