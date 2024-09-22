import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(3, { message: "Title should be at least 3 characters" }),
  description: z
    .string()
    .min(30, { message: "Description should be at least 30 characters" }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be number" })
    .positive({ message: "Price cannot be negative" }),
});
