"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PenSquare, PlusCircle, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductVariant } from "./product-variant";
import { useState } from "react";
import { DeleteAlertDialog } from "./delete-alert-dialog";
import ProductColumn from "@/types/product-column";

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
  let loadingToastId: string | number;
  const product = row.original;
  const [open, setOpen] = useState(false);

  const { execute, status } = useAction(deleteProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success);
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
    },
    onExecute: () => {
      loadingToastId = toast.loading("Removing product");
    },
  });

  const handleDelete = () => {
    execute({ id: product.id });
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2">
          <div className="flex flex-col gap-1">
            <DropdownMenuItem className="cursor-pointer focus:bg-primary/30">
              <div className="w-7">
                <PenSquare size={18} />
              </div>
              <Link href={`/dashboard/add-product?id=${product.id}`}>
                Edit product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              disabled={status === "executing"}
              className="cursor-pointer bg-destructive/10 dark:bg-destructive/35 focus:bg-destructive/35 dark:focus:bg-destructive/70 w-full"
            >
              <span className="w-7">
                <X size={18} />
              </span>
              Delete product
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAlertDialog
        open={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        item={product.title}
      />
    </>
  );
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];
      return (
        <div className="flex gap-2 items-center">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <ProductVariant
                        productId={variant.productId}
                        variant={variant}
                        editMode={true}
                      >
                        <div
                          className="w-5 h-5 rounded-full"
                          key={variant.id}
                          style={{
                            background: variant.color,
                          }}
                        />
                      </ProductVariant>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant
                    variant={
                      variants ? variants[variants.length - 1] : undefined
                    }
                    editMode={false}
                    productId={row.original.id}
                  >
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      let formattedPrice = new Intl.NumberFormat("en-US", {
        currency: "INR",
        style: "currency",
      }).format(price);

      formattedPrice = formattedPrice.replace("₹", "₹ ");

      return <div className="font-medium text-xs">{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl: string = row.getValue("image");
      const productTitle: string = row.getValue("title");
      return (
        <div className="">
          <Image
            src={imageUrl}
            alt={productTitle}
            sizes="40px"
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCell,
  },
];
