"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const title = params.get("title");
  const type = params.get("type");
  const id = Number(params.get("id"));
  const productId = Number(params.get("productId"));
  const price = Number(params.get("price"));
  const image = params.get("image");

  if (!id || !productId || !price || !image || !title || !type || !price) {
    toast.error("Invalid url");
    const router = useRouter();
    router.push("/");
    return;
  }

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => {
            if (quantity > 0) setQuantity(quantity - 1);
          }}
          disabled={quantity === 0}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1" variant={"outline"}>
          Quantity: {quantity}
        </Button>
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        className="w-full"
        disabled={quantity === 0}
        onClick={() => {
          toast.success(`${title} - ${type} added to cart`);
          addToCart({
            id: productId,
            variant: { variantId: id, quantity },
            image,
            name: title + " - " + type,
            price,
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
}
