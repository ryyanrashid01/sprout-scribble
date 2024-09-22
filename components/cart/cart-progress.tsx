"use client";

import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { ArrowLeft, Check, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartProgress({
  paymentStatus,
}: {
  paymentStatus: string | null;
}) {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();
  return (
    <motion.div animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 10 }}>
      <DrawerTitle className="flex justify-center">
        {checkoutProgress === "cart" ? "Cart items" : null}
        {checkoutProgress === "shipping" ? "Enter shipping address" : null}
        {checkoutProgress === "confirmation"
          ? paymentStatus === "success"
            ? "Order confirmed"
            : paymentStatus === "failed"
            ? "Order failed"
            : "Processing your order"
          : null}
      </DrawerTitle>
      <DrawerDescription className="flex justify-center py-1">
        {checkoutProgress === "cart" ? "View and edit your bag" : null}
        {checkoutProgress === "shipping" ? (
          <Button
            variant={"link"}
            className="flex items-center justify-center text-secondary-foreground"
            onClick={() => setCheckoutProgress("cart")}
          >
            <ArrowLeft size={14} className="mr-2" />
            Return to cart
          </Button>
        ) : null}
        {checkoutProgress === "confirmation"
          ? paymentStatus === "success"
            ? "Your order has been placed."
            : paymentStatus === "failed"
            ? "Payment failed. Order could not be completed."
            : "Your order is being processed. Please wait."
          : null}
      </DrawerDescription>
      <div className="flex items-center justify-center mt-3">
        <div className="w-64 h-3 bg-muted rounded-md relative -z-20">
          <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between">
            <motion.span
              className="absolute bg-primary left-3 top-0 z-30 ease-in-out h-full"
              initial={{ width: 0 }}
              animate={{
                width:
                  checkoutProgress === "cart"
                    ? 0
                    : checkoutProgress === "shipping"
                    ? "50%"
                    : "93%",
              }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-primary rounded-full p-2 z-50"
            >
              <ShoppingCart className="text-white" size={14} />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale:
                  checkoutProgress === "shipping"
                    ? 1
                    : 0 || checkoutProgress === "confirmation"
                    ? 1
                    : 0,
              }}
              transition={{ delay: 0.2 }}
              className="bg-primary rounded-full p-2 z-50"
            >
              <Truck className="text-white" size={14} />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: checkoutProgress === "confirmation" ? 1 : 0,
              }}
              transition={{ delay: 0.2 }}
              className="bg-primary rounded-full p-2 z-50"
            >
              <Check className="text-white" size={14} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
