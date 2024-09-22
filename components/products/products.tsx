"use client";

import { VariantsWithImagesTagsProduct } from "@/lib/infer-types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import formatPrice from "@/lib/format-price";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function Products({
  variants,
}: {
  variants: VariantsWithImagesTagsProduct[];
}) {
  const params = useSearchParams();
  const filterTag = params.get("tag");
  const filteredVariants = useMemo(() => {
    if (filterTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === filterTag)
      );
    }
    return variants;
  }, [filterTag]);

  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filteredVariants.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${
            variant.id
          }&color=${encodeURIComponent(variant.color)}&productId=${
            variant.productId
          }&price=${variant.product.price}&title=${
            variant.product.title
          }&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            className="rounded-md mb-3"
            src={variant.variantImages[0].url}
            width={720}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
