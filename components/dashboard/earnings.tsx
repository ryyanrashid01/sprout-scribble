"use client";

import formatPrice from "@/lib/format-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TotalOrders } from "@/lib/infer-types";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import weeklyChart from "@/lib/weekly-chart";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import monthlyChart from "@/lib/monthly-chart";

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "week";

  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total!,
  }));

  const activeChart = useMemo(() => {
    if (filter === "week") {
      const weekly = weeklyChart(chartItems);
      return weekly;
    } else if (filter === "month") {
      const monthly = monthlyChart(chartItems);
      return monthly;
    }
  }, [filter]);

  const totalRevenue = useMemo(() => {
    if (filter === "month") {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    } else {
      return weeklyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }
  }, [filter]);

  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle>Revenue: {formatPrice(totalRevenue)}</CardTitle>
        <CardDescription>Check your recent earnings here</CardDescription>
        <div className="flex gap-2 items-center">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics?filter=week", { scroll: false })
            }
          >
            This week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month"
                ? "bg-primary"
                : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
            )}
            onClick={() =>
              router.push("/dashboard/analytics?filter=month", {
                scroll: false,
              })
            }
          >
            This month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart data={activeChart}>
            <Tooltip
              content={(props) => (
                <div>
                  {props.payload?.map((item) => (
                    <div
                      key={item.payload.date}
                      className="bg-primary py-2 px-4 rounded-md shadow-lg"
                    >
                      <p>Revenue: {formatPrice(Number(item.value))}</p>
                      <p>Date: {item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey="revenue" className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
