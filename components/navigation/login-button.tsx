"use client";

import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginButton() {
  const pathname = usePathname();
  return (
    <li className="flex items-center">
      {pathname !== "/auth/login" ? (
        <Button asChild>
          <Link className="flex gap-2" href="/auth/login">
            <LogIn size={16} />
            <span>Login</span>
          </Link>
        </Button>
      ) : null}
    </li>
  );
}
