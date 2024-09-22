"use client";

import { useCartStore } from "@/lib/client-store";
import { UserOrders } from "@/lib/infer-types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Pen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import formatPrice from "@/lib/format-price";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function OrdersTable({
  userOrders,
}: {
  userOrders: UserOrders[];
}) {
  const params = useSearchParams();
  const payment_status = params.get("payment_status");
  const router = useRouter();
  const { setCheckoutProgress } = useCartStore();

  const paymentInitiated =
    typeof window !== "undefined" && localStorage.getItem("payment_initiated");

  useEffect(() => {
    if (!paymentInitiated) {
      router.push("/dashboard/orders");
    } else if (payment_status === "success" || payment_status === "failure") {
      setCheckoutProgress("confirmation");
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your orders</CardTitle>
        <CardDescription>
          Check your order details, leave reviews and more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of all your orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-center">Ordered on</TableHead>
              <TableHead className="text-center">More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        order.status === "confirmed"
                          ? "bg-green-200 text-green-700 hover:bg-green-400 hover:text-green-950"
                          : order.status === "failed"
                          ? "bg-red-300 text-red-700 hover:bg-red-500 hover:text-red-900"
                          : "bg-yellow-200 text-yellow-700 hover:bg-yellow-500 hover:text-yellow-900"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell className="text-center">
                    {order.created?.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <DialogTrigger className="w-full">
                              <Button variant={"ghost"} className="w-full">
                                View details
                              </Button>
                            </DialogTrigger>
                          </DropdownMenuItem>
                          {order.status === "confirmed" && (
                            <DropdownMenuItem>
                              <Link
                                href={`/dashboard/orders/receipts/${order.id}`}
                              >
                                <Button variant={"ghost"} className="w-full">
                                  View receipt
                                </Button>
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-center">
                            Order details for #{order.id}
                          </DialogTitle>
                          <DialogDescription className="text-xs text-muted-foreground text-center">
                            Your order total is {formatPrice(order.total)}
                          </DialogDescription>
                        </DialogHeader>
                        <Card className="overflow-auto p-2 flex flex-col gap-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-center">
                                  Quantity
                                </TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Review</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.orderProduct.map(
                                ({ product, variant, quantity }) => (
                                  <TableRow key={variant.id}>
                                    <TableCell>
                                      <Link
                                        href={`/products/${variant.id}?id=${variant.id}&productId=${product.id}&price=${product.price}&title=${product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
                                      >
                                        <Image
                                          src={variant.variantImages[0].url}
                                          alt={variant.variantImages[0].name}
                                          width={48}
                                          height={48}
                                          className="rounded-md"
                                        />
                                      </Link>
                                    </TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{variant.productType}</TableCell>
                                    <TableCell className="text-center">
                                      {quantity}
                                    </TableCell>
                                    <TableCell>
                                      {formatPrice(product.price)}
                                    </TableCell>
                                    <TableCell>
                                      <Link
                                        href={`/products/${variant.id}?id=${variant.id}&productId=${product.id}&price=${product.price}&title=${product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}#review-form`}
                                        className="flex justify-center items-center"
                                      >
                                        <Pen size={15} />
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </Card>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="mb-4">You haven't made any orders yet</div>
                  <Link href="/">
                    <Button>Browse products</Button>
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
