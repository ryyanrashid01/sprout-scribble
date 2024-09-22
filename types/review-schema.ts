import * as z from "zod";

export const ReviewSchema = z.object({
  productId: z.number(),
  rating: z
    .number()
    .min(1, { message: "Please add at least one star" })
    .max(5, { message: "Maximum number of stars you can add is 5" }),
  comment: z.string().min(10, { message: "Please add at least 10 characters" }),
});
