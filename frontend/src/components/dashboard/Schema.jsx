import { z } from "zod";

// Schema untuk registrasi 
export const registerShopSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .min(5, "Email must be at least 5 characters")
      .email("Email must be a valid email address")
      .regex(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Email must be a valid Gmail address"
      )
      .transform((email) => email.toLowerCase()),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits"),
    address: z
      .string()
      .min(1, "Address is required")
      .min(5, "Address must be at least 5 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(5, "Password must be at least 5 characters"),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required")
      .min(5, "Password confirmation must be at least 5 characters")
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
  });
