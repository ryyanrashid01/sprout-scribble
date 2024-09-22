"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export default function Toaster() {
  const { theme } = useTheme();
  if (typeof theme === "string") {
    return (
      <SonnerToaster
        position="top-center"
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    );
  }
}
