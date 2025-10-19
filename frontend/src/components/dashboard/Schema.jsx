import { z } from "zod";

export const registerShopSchema = z.object({
  shopName: z
    .string()
    .min(1, "Shop name is required")
    .min(4, "Shop name must be at least 4 characters"),
  shopTelephone: z
    .string()
    .min(1, "Shop Phone number is required")
    .regex(/^[0-9]+$/, "Shop Phone number must contain only digits")
    .min(10, "Shop phone number must be at least 10 digits"),
  shopAddress: z
    .string()
    .min(1, "Shop address is required")
    .min(5, "Shop address must be at least 5 characters"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^[0-9]+$/, "Account number must contain only digits")
    .min(10, "Account number must be at least 10 digits"),
  qrisPicture: z
    .custom((val) => val instanceof FileList, {
      message: "QRIS picture is required",
    })
    .refine((files) => files.length > 0, {
      message: "QRIS picture is required",
    })
    .transform((files) => files[0]) // convert FileList -> File
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must not exceed 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Only JPG and PNG formats are allowed",
      }
    ),
});


export const editShopSchema = z.object({
  shopName: z
    .string()
    .min(1, "Shop name is required")
    .min(4, "Shop name must be at least 4 characters"),
  shopTelephone: z
    .string()
    .min(1, "Shop Phone number is required")
    .regex(/^[0-9]+$/, "Shop Phone number must contain only digits")
    .min(10, "Shop phone number must be at least 10 digits"),
  shopAddress: z
    .string()
    .min(1, "Shop address is required")
    .min(5, "Shop address must be at least 5 characters"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^[0-9]+$/, "Account number must contain only digits")
    .min(10, "Account number must be at least 10 digits"),
  qrisPicture: z
    .union([
      z
        .custom((val) => val instanceof FileList, {
          message: "Invalid file input",
        })
        .refine((files) => files.length === 0 || files.length > 0, {
          message: "Invalid file input",
        })
        .transform((files) => (files.length > 0 ? files[0] : null))
        .refine(
          (file) =>
            !file ||
            (file.size <= 5 * 1024 * 1024 &&
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type)),
          {
            message:
              "QRIS picture must be JPG/PNG format and not exceed 5MB if uploaded",
          }
        ),
      z.null(),
    ])
    .optional(),
});
