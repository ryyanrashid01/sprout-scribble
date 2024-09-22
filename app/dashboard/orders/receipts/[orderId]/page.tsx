import Receipt from "@/components/dashboard/receipt";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ReceiptPage({
  params,
}: {
  params: { orderId: number };
}) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const { orderId } = params;
  const order = await db.query.orders.findFirst({
    with: {
      orderProduct: {
        with: {
          variant: { with: { variantImages: true } },
          product: true,
          order: true,
        },
      },
      shippingAddress: true,
    },
    where: eq(orders.id, orderId),
  });

  if (!order) {
    return (
      <div className="flex items-center justify-center mt-11 bg-red-300 text-red-900 max-w-md font-bold rounded-md p-3 mx-auto">
        Order #{orderId} not found
      </div>
    );
  }

  if (order.userId != session.user.id) {
    redirect("/dashboard/orders");
  }

  return <Receipt order={order} />;
}
