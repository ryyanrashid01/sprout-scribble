"use client";

import { ProductSchema } from "@/types/products-schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { IndianRupee, LoaderCircle } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/server/actions/create-product";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

export default function AddProductForm() {
  const editMode = useSearchParams().get("id");
  const router = useRouter();

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct({ id });
      if (!data) {
        toast.error("Something went wrong");
        return;
      }
      if (data.data?.error) {
        toast.error(data.data.error);
        router.push("/dashboard/products");
        return;
      }
      if (data.data?.success) {
        const id = parseInt(editMode);
        form.setValue("title", data.data.success.title);
        form.setValue("description", data.data.success.description);
        form.setValue("price", data.data.success.price);
        form.setValue("id", id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      toast.dismiss();
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data?.success);
        router.push("/dashboard/products");
      }
    },
    onExecute: () => {
      toast.loading(editMode ? "Updating product details" : "Adding product");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    execute(values);
  }

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{editMode ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Handcrafted Leather Journal"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="py-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Tiptap value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="py-2">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <IndianRupee
                          size={32}
                          className=" p-2 bg-muted rounded-md"
                        />
                        <Input
                          {...field}
                          type="number"
                          placeholder="Product price"
                          step="0.01"
                          min="0"
                          disabled={status === "executing"}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  className={cn(
                    "w-1/5",
                    status === "executing"
                      ? "animate-pulse cursor-not-allowed"
                      : ""
                  )}
                  type="submit"
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                >
                  {status === "executing" ? (
                    <LoaderCircle className="animate-spin" />
                  ) : editMode ? (
                    "Update product"
                  ) : (
                    "Add product"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
