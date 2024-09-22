import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sprout & Scribbles",
  description: "An e-commerce website for stationary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div
          className={cn(
            "px-6 md:px-12 max-w-8xl mx-auto scroll-smooth",
            `${roboto.className}`
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#f97316" height={5} showSpinner={false} />
            <Nav />
            {children}
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
