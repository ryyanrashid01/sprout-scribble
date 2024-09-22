"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductImages({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const selectedColor =
    useSearchParams().get("type") || variants[0].productType;

  useEffect(() => {
    if (!api) return;

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, idx) => {
              return (
                <CarouselItem key={img.url}>
                  {img.url ? (
                    <Image
                      className="rounded-md"
                      src={img.url}
                      priority
                      alt={variant.productType}
                      width={1280}
                      height={720}
                    />
                  ) : null}
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, idx) => {
              return (
                <div key={img.url}>
                  {img.url ? (
                    <Image
                      src={img.url}
                      className={cn(
                        idx === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-75",
                        "rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:opacity-75"
                      )}
                      priority
                      alt={variant.productType}
                      width={72}
                      height={48}
                      onClick={() => updatePreview(idx)}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
}
