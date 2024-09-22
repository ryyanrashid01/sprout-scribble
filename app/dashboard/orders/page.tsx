import OrdersTable from "@/components/dashboard/orders-table";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Orders() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  const data = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    with: {
      orderProduct: {
        with: {
          order: true,
          variant: { with: { variantImages: true } },
          product: true,
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.created)],
  });

  return <OrdersTable userOrders={data} />;
}
