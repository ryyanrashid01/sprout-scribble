import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { orderProduct } from "@/server/schema";
import { desc } from "drizzle-orm";
import Sales from "@/components/dashboard/sales";
import Earnings from "@/components/dashboard/earnings";
import PopularItems from "@/components/dashboard/popular-items";

export const revalidate = 0;

export default async function Analytics() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect("/dashboard");
  }

  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    with: {
      order: { with: { user: true } },
      product: true,
      variant: { with: { variantImages: true } },
    },
    limit: 10,
  });

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No orders found.</CardTitle>
          <CardDescription>No orders have been made yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (totalOrders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Check your sales, new customers and more
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-8">
          <Sales totalOrders={totalOrders} />
          <div className="flex flex-1 flex-col gap-4">
            <Earnings totalOrders={totalOrders} />
            <PopularItems />
          </div>
        </CardContent>
      </Card>
    );
  }
}
