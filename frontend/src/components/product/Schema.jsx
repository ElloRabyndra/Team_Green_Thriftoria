import { z } from "zod";

// Schema untuk product
export const addProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be at most 100 characters"),

  label: z
    .string()
    .min(1, "label is required")
    .min(3, "label must be at least 3 characters"),

  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^[0-9]+$/, "Price must contain only digits"),

  stock: z
    .string()
    .min(1, "Stock is required")
    .regex(/^[0-9]+$/, "Stock must contain only digits"),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),

  image: z
    .any()
    .optional(),
});

export const editProductSchema = addProductSchema.partial();