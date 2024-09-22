"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ShippingSchema } from "@/types/shipping-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { LoaderCircle, Lock } from "lucide-react";
import { useCartStore } from "@/lib/client-store";
import { useMemo } from "react";
import formatPrice from "@/lib/format-price";
import { customAlphabet } from "nanoid";
import sha256 from "crypto-js/sha256";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";

export default function ShippingForm({ session }: { session: Session | null }) {
  const router = useRouter();
  const { cart, clearCart, setCheckoutProgress } = useCartStore();
  let loadingToastId: number | string;

  if (!session || !session.user) {
    router.push("/auth/login");
    return null;
  }

  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ", 16);
  const transactionId = "TR-" + nanoid();

  const form = useForm<z.infer<typeof ShippingSchema>>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      name: session.user.name! || "",
      address1: "",
      address2: "",
      email: session.user.email! || "",
      phone: undefined,
      pincode: undefined,
      transactionId: transactionId,
      cart: cart.map((item) => ({
        productId: item.id,
        variantId: item.variant.variantId,
        quantity: item.variant.quantity,
        price: item.price,
      })),
    },
    mode: "onChange",
  });

  const makePayment = async () => {
    const phonepePayload = {
      merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANTID,
      merchantTransactionId: transactionId,
      merchantUserId: session.user.id,
      amount: totalPrice * 100,
      redirectUrl: `http://localhost:3000/api/payment-status/${transactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://locahost:3000/api/payment-status/${transactionId}`,
      mobileNumber: form.getValues("phone"),
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const dataPayload = JSON.stringify(phonepePayload);
    const payloadBase64 = Buffer.from(dataPayload).toString("base64");

    const fullUrl =
      payloadBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY;
    const payloadSha256 = sha256(fullUrl);
    const checksum =
      payloadSha256 + "###" + process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_PAY_UPI_URL!,
        {
          request: payloadBase64,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
          },
        }
      );

      const redirectUrl =
        response.data.data.instrumentResponse.redirectInfo.url;
      return redirectUrl;
    } catch (error) {
      console.error(error);
    }
  };

  const { execute, status } = useAction(createOrder, {
    onSuccess: async (data) => {
      if (data.data?.error) {
        toast.error(data.data.error, { id: loadingToastId });
      }
      if (data.data?.success) {
        localStorage.setItem("payment_initiated", "true");

        toast.info(data.data.success, { id: loadingToastId });

        const redirectUrl = await makePayment();

        setCheckoutProgress("confirmation");
        router.push(redirectUrl);
      }
    },
    onExecute: () => {
      loadingToastId = toast.loading("Creating order");
    },
  });

  const onSubmit = async (values: z.infer<typeof ShippingSchema>) => {
    execute(values);
  };

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.price * item.variant.quantity,
      0
    );
  }, [cart]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mb-3 max-h-full mx-auto"
      >
        <div className="flex items-center justify-stretch gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Recipient full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={status === "executing"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@company.com"
                    disabled={status === "executing"}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="Street No., House No. or PO Box"
                  disabled={status === "executing"}
                  maxLength={100}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartment No., Suite or Unit"
                  disabled={status === "executing"}
                  {...field}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="hidden" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-stretch gap-4">
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>PIN Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="190001"
                    min={100000}
                    max={999999}
                    disabled={status === "executing"}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <div className="flex items-center border rounded-md">
                    <span className="text-sm min-w-fit p-3">+91</span>
                    <Input
                      placeholder="1234567890"
                      type="number"
                      disabled={status === "executing"}
                      min={1000000000}
                      max={9999999999}
                      className="w-full border-none focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={status === "executing"}
        >
          {status === "executing" ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <div className="flex items-center">
              <Lock className="mr-4" size={14} />
              Proceed to pay {formatPrice(totalPrice)}
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
