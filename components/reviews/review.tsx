"use client";

import { ReviewsWithUser } from "@/lib/infer-types";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import Stars from "./stars";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteAlertDialog } from "../dashboard/delete-alert-dialog";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { deleteReview } from "@/server/actions/delete-review";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Review({
  reviews,
  isUserReview = false,
  canReview = false,
}: {
  reviews: ReviewsWithUser[];
  isUserReview?: boolean;
  canReview?: boolean;
}) {
  const [open, setOpen] = useState(false);
  let loadingToastId: string | number;

  const { execute, status } = useAction(deleteReview, {
    onExecute() {
      loadingToastId = toast.loading("Removing your review");
    },
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success, { id: loadingToastId });
      }
      if (data.data?.error) {
        toast.error(data.data.error, { id: loadingToastId });
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const handleDelete = () => {
    execute({ id: reviews[0].id, productId: reviews[0].productId });
    setOpen(false);
  };

  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.length === 0 && (
        <Card className="p-4">
          <div className="flex items-center">
            <p className="font-bold">No reviews yet</p>
          </div>
          <p className="text-sm font-medium my-4">
            {canReview
              ? "Be the first to review this product."
              : "Buy it and be the first to review this product."}
          </p>
        </Card>
      )}
      {reviews.map((review, index) => (
        <Card key={review.id} className="p-4">
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <Image
                className="rounded-full"
                width={32}
                height={32}
                alt={review.user.name!}
                src={review.user.image!}
              />
              <div>
                <div>
                  <p className="font-bold text-md">{review.user.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={review.rating} showText={false} />
                  <p className="text-xs text-bold text-muted-foreground">
                    {formatDistance(subDays(review.created!, 0), new Date())}{" "}
                    ago
                  </p>
                </div>
              </div>
            </div>
            {index == 0 && isUserReview && (
              <div className="flex items-start">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Trash2
                        size={18}
                        onClick={() => setOpen(true)}
                        className={cn(
                          "text-primary hover:text-red-600 cursor-pointer transition-all ease-in-out duration-200"
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete review</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <p className="text-sm my-4">{review.comment}</p>
        </Card>
      ))}
      <DeleteAlertDialog
        open={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        item="your review"
      />
    </motion.div>
  );
}
