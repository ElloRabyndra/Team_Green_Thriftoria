import { z } from "zod";

// Schema untuk product
export const addProductSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .min(3, "Product title must be at least 3 characters")
    .max(100, "Product title must be at most 100 characters"),

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
  category: z
    .string()
    .min(1, "Category is required"),
  description: z
    .string()
    .min(1, "Description is required"),

  thumbnail: z
    .any()
    .optional(),
});

export const editProductSchema = addProductSchema.partial();