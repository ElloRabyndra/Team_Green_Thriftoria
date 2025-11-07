import { z } from "zod";

// Ukuran maksimum file: 1MB 
export const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const checkoutSchema = z.object({
  recipient: z
    .string()
    .min(1, "Recipient is required")
    .min(3, "Recipient must be at least 3 characters"), // Diperbaiki dari 4 ke 3 agar konsisten dengan pesan error
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
    .transform((files) => files[0]) // PERBAIKAN: Sinkronisasi ukuran file ke 1MB
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "File size must not exceed 1MB",
    })
    .refine(
      // PERBAIKAN: Tambahkan JPG, karena file type seringkali image/jpeg meskipun ekstensi jpg
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file?.type
        ),
      {
        message: "Only JPEG, PNG, JPG, or WEBP formats are allowed",
      }
    ),
});
