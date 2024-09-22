"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeframe } from "@/lib/time-frame";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import formatPrice from "@/lib/format-price";

interface PopularItems {
  created: Date;
  productId: number;
  productName: string;
  productVariantId: number;
  productPrice: number;
  totalQuantity: string;
  variantName: string;
  variantImages: string[];
}

export default function PopularItems() {
  const [timeframe, setTimeframe] = useState<Timeframe>("thisWeek");
  const [popularItems, setPopularItems] = useState<PopularItems[]>();
  const [loading, setLoading] = useState(false);

  const fetchPopularItems = async () => {
    try {
      const response = await axios.post(
        "/api/popular-items",
        { timeframe },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setPopularItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching popular items:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPopularItems();
  }, [timeframe]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular items</CardTitle>
        <CardDescription>Check your most popular items here.</CardDescription>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            className={cn(
              "cursor-pointer",
              timeframe === "thisWeek"
                ? "bg-primary"
                : "bg-primary/50 dark:bg-primary/25 dark:hover:bg-primary/50"
            )}
            onClick={() => setTimeframe("thisWeek")}
          >
            This week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              timeframe === "thisMonth"
                ? "bg-primary"
                : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
            )}
            onClick={() => setTimeframe("thisMonth")}
          >
            This month
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              timeframe === "last6Months"
                ? "bg-primary"
                : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
            )}
            onClick={() => setTimeframe("last6Months")}
          >
            6 months
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              timeframe === "lastYear"
                ? "bg-primary"
                : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
            )}
            onClick={() => setTimeframe("lastYear")}
          >
            1 year
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              timeframe === "allTime"
                ? "bg-primary"
                : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
            )}
            onClick={() => setTimeframe("allTime")}
          >
            All time
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96 overflow-auto">
        {!loading && (
          <Table className="overflow-auto">
            <TableCaption>A list of your most popular items.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Product</TableHead>
                <TableHead className="w-32">Variant</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Unit price</TableHead>
                <TableHead className="text-right">Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto">
              {popularItems?.map((item) => (
                <TableRow key={item.productVariantId}>
                  <TableCell className="w-32">{item.productName}</TableCell>
                  <TableCell>{item.variantName}</TableCell>
                  <TableCell className="text-center">
                    {item.totalQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatPrice(item.productPrice)}
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <Image
                      src={item.variantImages[0]}
                      alt={item.productName + " " + item.variantName}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoaderCircle size={25} className="animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
