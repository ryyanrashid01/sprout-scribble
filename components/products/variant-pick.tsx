"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function VariantPick({
  id,
  color,
  productType,
  title,
  price,
  productId,
  image,
  isFirst,
}: {
  id: number;
  color: string;
  title: string;
  productType: string;
  price: number;
  productId: number;
  image: string;
  isFirst: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type");

  return (
    <div
      style={{ background: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:opacity-75",
        selectedType === productType || (!selectedType && isFirst)
          ? "opacity-100 outline dark:outline-white outline-2 outline-gray-800 outline-offset-2"
          : "opacity-50"
      )}
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productId=${productId}&price=${price}&title=${title}&type=${productType}&image=${image}&color=${color}`,
          { scroll: false }
        )
      }
    ></div>
  );
}
