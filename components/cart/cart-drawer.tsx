"use client";

import { useCartStore } from "@/lib/client-store";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";
import { useEffect, useState } from "react";
import CartProgress from "./cart-progress";
import ShippingForm from "./shipping-form";
import { Session } from "next-auth";
import PaymentConfirmation from "./payment-confirmation";
import { useSearchParams } from "next/navigation";

export default function CartDrawer({ session }: { session: Session | null }) {
  const { cart, checkoutProgress, setCheckoutProgress } = useCartStore();
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment_status");
  const paymentInitiated =
    typeof window !== "undefined" && localStorage.getItem("payment_initiated");

  useEffect(() => {
    if (
      paymentInitiated &&
      (paymentStatus === "success" || paymentStatus === "failure")
    ) {
      setCheckoutProgress("confirmation");
      setOpen(true);
    }
  }, [paymentInitiated, paymentStatus]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        onClick={() => {
          setCheckoutProgress("cart");
          localStorage.removeItem("payment_initiated");
        }}
      >
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute flex items-center justify-center -top-1.5 -right-1.5 w-4 h-4 dark:bg-primary bg-primary text-xs font-bold rounded-full text-white"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag className="group-hover:text-primary" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-70vh">
        <DrawerHeader className="flex justify-center">
          <CartProgress paymentStatus={paymentStatus} />
        </DrawerHeader>
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart" && <CartItems onOpenChange={setOpen} />}
          {checkoutProgress === "shipping" && (
            <ShippingForm session={session} />
          )}
          {checkoutProgress === "confirmation" && (
            <PaymentConfirmation paymentStatus={paymentStatus} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
