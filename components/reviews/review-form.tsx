"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { ReviewSchema } from "@/types/review-schema";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { LoaderCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { addReview } from "@/server/actions/add-review";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ReviewForm({
  isUserReview = false,
}: {
  isUserReview?: boolean;
}) {
  const params = useSearchParams();
  const productId = Number(params.get("productId"));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash === "review-form") {
      setOpen(true);

      const element = document.getElementById("review-form");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      productId,
      comment: "",
      rating: 0,
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
        form.reset();
      }
    },
  });

  async function onSubmit(values: z.infer<typeof ReviewSchema>) {
    execute({
      productId: productId,
      comment: values.comment,
      rating: values.rating,
    });
  }

  return (
    <div id="review-form">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <Button className="font-medium w-full" variant={"secondary"}>
              Leave a review
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {isUserReview ? (
            <div>You have already reviewed this product</div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave your review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How would you describe this product?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate this product</FormLabel>
                      <FormControl>
                        <Input
                          type="hidden"
                          placeholder="Star rating"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => {
                          return (
                            <motion.div
                              key={value}
                              className="relative cursor-pointer"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <Star
                                key={value}
                                strokeWidth={1}
                                onClick={() => {
                                  form.setValue("rating", value, {
                                    shouldValidate: true,
                                  });
                                }}
                                className={cn(
                                  "text-primary bg-transparent transition-all duration-200 ease-in-out",
                                  form.getValues("rating") >= value
                                    ? "fill-primary"
                                    : "fill-muted"
                                )}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={status === "executing"}
                  className="w-full"
                >
                  {status === "executing" ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Add review"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
