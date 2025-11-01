import { z } from "zod";
export const checkoutSchema = z.object({
  recipient: z
    .string()
    .min(1, "Recipient is required")
    .min(4, "Recipient must be at least 3 characters"),
  telephone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters"),
  note: z.string().optional().or(z.literal("")),
  proof_payment: z
    .any()
    .refine((files) => files?.length === 1, {
      message: "Proof payment is required",
    })
    .transform((files) => files[0])
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "File size must not exceed 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file?.type),
      {
        message: "Only JPG and PNG formats are allowed",
      }
    ),
});
