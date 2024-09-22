"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/lib/client-store";
import formatPrice from "@/lib/format-price";
import { MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import emptyCart from "@/public/empty-box.json";
import { createId } from "@paralleldrive/cuid2";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartItems({
  onOpenChange,
}: {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();
  const [isEmpty, setIsEmpty] = useState(false);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.price * item.variant.quantity,
      0
    );
  }, [cart]);

  const priceInDigits = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter: letter, id: createId() };
    });
  }, [totalPrice]);

  useEffect(() => {
    if (cart.length === 0) {
      const timeout = setTimeout(() => setIsEmpty(true), 200);
      return () => clearTimeout(timeout);
    } else {
      setIsEmpty(false);
    }
  }, [cart]);

  return (
    <motion.div className="flex flex-col items-center">
      <AnimatePresence>
        {isEmpty && (
          <div className="flex-col w-full flex items-center justify-center mt-7">
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl text-muted-foreground text-center">
                Your cart looks empty
              </h2>
              <Lottie className="h-72" animationData={emptyCart} />
            </motion.div>
          </div>
        )}
        {!isEmpty && (
          <div className="max-h-80 w-full overflow-y-auto">
            <Table className="max-w-4xl mx-auto">
              <TableHeader>
                <TableRow className="font-bold">
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {cart.map((cartItem) =>
                    cartItem.variant.quantity > 0 ? (
                      <motion.tr
                        key={cartItem.variant.variantId}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell
                          className="cursor-pointer"
                          onClick={() => {
                            onOpenChange(false);
                          }}
                        >
                          <Link
                            href={`/products/${cartItem.variant.variantId}?id=${
                              cartItem.variant.variantId
                            }&productId=${cartItem.id}&price=${
                              cartItem.price
                            }&title=${cartItem.name.split(" - ")[0]}&type=${
                              cartItem.name.split(" - ")[1]
                            }&image=${cartItem.image}`}
                          >
                            {cartItem.name}
                          </Link>
                        </TableCell>
                        <TableCell>{formatPrice(cartItem.price)}</TableCell>
                        <TableCell>
                          <div>
                            <Image
                              className="rounded-md"
                              src={cartItem.image}
                              alt={cartItem.name}
                              width={48}
                              height={48}
                              priority
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-between gap-2">
                            <MinusCircle
                              className="cursor-pointer hover:text-muted-foreground duration-200 transition-all ease-in-out"
                              size={14}
                              onClick={() => {
                                removeFromCart({
                                  ...cartItem,
                                  variant: {
                                    ...cartItem.variant,
                                    quantity: 1,
                                  },
                                });
                              }}
                            />
                            <p className="text-md font-bold">
                              {cartItem.variant.quantity}
                            </p>
                            <PlusCircle
                              className="cursor-pointer hover:text-muted-foreground duration-200 transition-all ease-in-out"
                              size={14}
                              onClick={() => {
                                addToCart({
                                  ...cartItem,
                                  variant: {
                                    ...cartItem.variant,
                                    quantity: 1,
                                  },
                                });
                              }}
                            />
                          </div>
                        </TableCell>
                      </motion.tr>
                    ) : null
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </AnimatePresence>

      {!isEmpty && (
        <div className="w-full flex flex-col items-center justify-center">
          <motion.div className="flex items-center justify-center relative overflow-hidden mt-6">
            <span className="font-bold">Total: ₹&nbsp;</span>
            <AnimatePresence mode={"popLayout"}>
              {priceInDigits.map((letter, index) => (
                <motion.div key={letter.id}>
                  <motion.span
                    animate={{ y: 0 }}
                    initial={{ y: 20 }}
                    exit={{ y: -20 }}
                    className="font-bold inline-block"
                    transition={{ delay: 0.1 * index }}
                  >
                    {letter.letter}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Button
            onClick={() => {
              setCheckoutProgress("shipping");
            }}
            disabled={cart.length === 0}
            className="max-w-md w-full my-4"
          >
            Checkout
          </Button>
        </div>
      )}
    </motion.div>
  );
}
