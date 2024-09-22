"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export default function Stars({
  rating,
  totalReviews,
  size = 14,
  showText = true,
}: {
  rating: number;
  totalReviews?: number;
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className="flex items-center">
      {showText ? (
        <p className="mr-2 text-xs font-medium">{rating.toFixed(1)}</p>
      ) : null}
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            "text-primary bg-transparent transition-all duration-200 ease-in-out",
            rating >= star ? "fill-primary" : "fill-muted"
          )}
        />
      ))}
      <span className="text-secondary-foreground font-bold text-xs ml-2">
        {showText
          ? totalReviews
            ? `(${totalReviews})`
            : "No ratings yet"
          : null}
      </span>
    </div>
  );
}
