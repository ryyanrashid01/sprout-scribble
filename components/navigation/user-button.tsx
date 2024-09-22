"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import {
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  TruckIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export const UserButton = ({ user }: Session) => {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [resolvedTheme]);

  if (user) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="w-7 h-7">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name!}
                className="rounded-full object-cover"
                fill={true}
                sizes="40px"
                priority
              />
            )}
            {!user.image && (
              <AvatarFallback className="bg-primary/25">
                <div className="bold">{user.name?.charAt(0).toUpperCase()}</div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6">
          <div className="mb-4 p-4 flex flex-col items-center rounded-lg bg-primary/15">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name!}
                className="rounded-full"
                width={36}
                height={36}
              />
            )}
            <p className="font-bold text-xs">{user.name}</p>
            <span className="text-xs font'medium text-secondary-foreground">
              {user.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <div className="flex flex-col gap-1">
            <DropdownMenuItem
              onClick={() =>
                user.role === "admin"
                  ? router.push("/dashboard/analytics")
                  : router.push("/dashboard/orders")
              }
              className="group py-2 font-medium focus:bg-primary/30 cursor-pointer"
            >
              <LayoutDashboard
                size={14}
                className="mr-3 group-hover:scale-[1.15] transition-all duration-200 ease-in-out"
              />{" "}
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/orders")}
              className="group py-2 font-medium focus:bg-primary/30 cursor-pointer"
            >
              <TruckIcon
                size={14}
                className="mr-3 group-hover:translate-x-1 transition-all duration-200 ease-in-out"
              />{" "}
              Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/user/settings")}
              className="group py-2 font-medium focus:bg-primary/30 cursor-pointer"
            >
              <Settings
                size={14}
                className="mr-3 group-hover:rotate-180 transition-all duration-200 ease-in-out"
              />{" "}
              Settings
            </DropdownMenuItem>
            {theme && (
              <DropdownMenuItem className="py-2 font-medium focus:bg-primary/30 cursor-pointer">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center group"
                >
                  <Sun
                    size={14}
                    className="group-hover:text-yellow-600 group-hover:rotate-180 dark:hidden mr-3 transition-all duration-200 ease-in-out"
                  />
                  <Moon
                    size={14}
                    className="group-hover:text-blue-400 group-hover:drop-shadow-[0_0_4px_rgba(96,165,250,1)] group-hover:scale-110 mr-3 dark:inline-block hidden"
                  />
                  <p className="dark:text-blue-400 text-secondary-foreground/75 text-yellow-600">
                    {theme[0].toUpperCase() + theme.slice(1)} mode
                  </p>
                  <Switch
                    className="scale-75 ml-2"
                    checked={checked}
                    onCheckedChange={(e) => {
                      setChecked((prev) => !prev);
                      if (e) setTheme("dark");
                      if (!e) setTheme("light");
                    }}
                  />
                </div>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => signOut()}
              className="group py-2 bg-destructive/10 dark:bg-destructive/35 font-medium cursor-pointer focus:bg-destructive/35 dark:focus:bg-destructive/70"
            >
              <LogOut
                size={14}
                className="mr-3 group-hover:scale-75 transition-all duration-200 ease-in-out"
              />
              Log out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};
