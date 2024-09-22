"use client";

import Lottie from "lottie-react";
import orderProcessing from "@/public/order-processing.json";
import { motion } from "framer-motion";
import orderConfirmed from "@/public/order-confirmed.json";
import { PackageCheck, PackageX } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCartStore } from "@/lib/client-store";
import orderFailed from "@/public/order-failed.json";
import { useEffect } from "react";

export default function PaymentConfirmation({
  paymentStatus,
}: {
  paymentStatus: string | null;
}) {
  const { setCheckoutProgress, clearCart } = useCartStore();
  useEffect(() => {
    if (paymentStatus === "success" || paymentStatus === "failure") {
      localStorage.removeItem("payment_initiated");
    }
    clearCart();
  }, []);
  return (
    <div>
      {paymentStatus === "success" ? (
        <div className="flex-col w-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Lottie
              className="h-96"
              animationData={orderConfirmed}
              loop={false}
            />
            <h2 className="flex gap-2 items-center text-sm text-muted-foreground text-center font-bold bg-green-200 text-green-900 p-2 rounded-md">
              <PackageCheck size={24} /> Congratulations! Your order has been
              placed.
            </h2>
            <Link
              href="/"
              className="flex justify-center items-center"
              onClick={() => {
                localStorage.removeItem("payment_initiated");
                setCheckoutProgress("cart");
              }}
            >
              <Button variant={"link"}>Back to browsing</Button>
            </Link>
          </motion.div>
        </div>
      ) : paymentStatus === "failed" ? (
        <div className="flex-col w-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Lottie className="h-96" animationData={orderFailed} loop={false} />
            <h2 className="flex gap-2 items-center text-sm text-muted-foreground text-center font-bold bg-red-200 text-red-900 p-2 rounded-md">
              <PackageX size={24} /> Payment failed. Your order could not be
              placed.
            </h2>
            <Link
              href="/"
              className="flex justify-center items-center"
              onClick={() => {
                localStorage.removeItem("payment_initiated");
                setCheckoutProgress("cart");
              }}
            >
              <Button variant={"link"}>Back to browsing</Button>
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="flex-col w-full flex items-center justify-center mt-7">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Lottie className="h-72" animationData={orderProcessing} />
            <h2 className="text-sm text-muted-foreground text-center">
              You will be redirected to payment page shortly
            </h2>
          </motion.div>
        </div>
      )}
    </div>
  );
}
