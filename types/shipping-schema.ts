import * as z from "zod";

export const ShippingSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  address1: z.string().min(8, { message: "Address is too short" }),
  address2: z.optional(z.string()),
  email: z.optional(z.string().email()),
  cart: z.array(
    z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number().positive({ message: "Quantity must be positive" }),
      price: z.number().positive({ message: "Price must be positive" }),
    })
  ),
  transactionId: z
    .string()
    .min(19, { message: "Transaction ID should be at least 19 characters" }),
  phone: z.coerce
    .number({ message: "Phone number must contain only digits" })
    .min(1000000000, { message: "Phone number must be 10 digits" })
    .max(9999999999, { message: "Phone number must be 10 digits" }),
  pincode: z.coerce
    .number({ message: "Pincode must contain only digits" })
    .min(100000, { message: "Pincode must be 6 digits" })
    .max(999999, { message: "Pincode must be 6 digits" }),
});
