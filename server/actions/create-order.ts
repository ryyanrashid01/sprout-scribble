"use server";

import { createSafeActionClient } from "next-safe-action";
import { orders, orderProduct, shippingAddresses } from "@/server/schema";
import { revalidatePath } from "next/cache";
import { ShippingSchema } from "@/types/shipping-schema";
import { auth } from "@/server/auth";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .schema(ShippingSchema)
  .action(
    async ({
      parsedInput: {
        name,
        email,
        address1,
        address2,
        transactionId,
        pincode,
        phone,
        cart,
      },
    }) => {
      try {
        const session = await auth();
        if (!session) return { error: "Please login to order" };

        const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
        const dbPool = drizzle(pool);

        await dbPool.transaction(async (tx) => {
          const newOrder = await tx
            .insert(orders)
            .values({
              userId: session.user.id,
              total: cart.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              ),
              status: "pending",
              transactionId: transactionId,
            })
            .returning();

          const newOrderId = newOrder[0].id;

          await tx.insert(orderProduct).values(
            cart.map((item) => ({
              orderId: newOrderId,
              productId: item.productId,
              productVariantId: item.variantId,
              quantity: item.quantity,
            }))
          );

          await tx.insert(shippingAddresses).values({
            orderId: newOrderId,
            name: name,
            address1: address1,
            address2: address2 ?? undefined,
            email: email ?? undefined,
            phone: String(phone),
            pincode: String(pincode),
          });
        });

        revalidatePath("/dashboard/orders");

        return {
          success: "Order request received. Waiting for payment.",
        };
      } catch (error) {
        console.error("Error creating order:", error);
        return { error: "Failed to create order." };
      }
    }
  );
