"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    } else {
      router.push("/");
    }
  };
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("notebook")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          tag === "notebook"
            ? "opacity-100"
            : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
        )}
      >
        Notebooks
      </Badge>
      <Badge
        onClick={() => setFilter("bag")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          tag === "bag"
            ? "opacity-100"
            : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
        )}
      >
        Bags
      </Badge>
      <Badge
        onClick={() => setFilter("writing")}
        className={cn(
          "cursor-pointer hover:opacity-100",
          tag === "writing"
            ? "opacity-100"
            : "bg-primary/65 dark:bg-primary/25 dark:hover:bg-primary/50"
        )}
      >
        Writing
      </Badge>
    </div>
  );
}
