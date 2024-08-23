"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type BackButtonType = {
  href: string;
  label: string;
};

export const BackButton = ({ href, label }: BackButtonType) => {
  return (
    <Button className="font-medium min-w-fit mx-auto" variant={"link"} asChild>
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
};
