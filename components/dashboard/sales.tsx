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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-types";
import Image from "next/image";
import placeholderUser from "@/public/placeholder-user.jpg";
import formatPrice from "@/lib/format-price";

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
        <CardDescription>Details about recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(({ order, product, quantity, variant }) => (
              <TableRow key={order.id}>
                <TableCell>
                  {order.user.image && order.user.name ? (
                    <div className="flex gap-2 w-32 items-center">
                      <Image
                        src={order.user.image}
                        width={30}
                        height={30}
                        alt={order.user.name!}
                        className="rounded-full"
                      />
                      <p className="text-xs font-medium">{order.user.name}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center justify-center">
                      <Image
                        src={placeholderUser}
                        width={30}
                        height={30}
                        alt={"User not found"}
                      />
                      <p className="text-xs font-medium">User not found</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>
                  <Image
                    src={variant.variantImages[0].url}
                    width={50}
                    height={50}
                    alt={product.title}
                    className="rounded-sm"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
