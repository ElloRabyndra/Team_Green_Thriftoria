import { z } from "zod";

// Schema untuk registrasi 
export const registerSchema = z.object({
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

// Schema untuk login 
export const loginSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .min(5, "Email must be at least 5 characters")
      .email("Email must be a valid email address")
      .regex(/^[^\s@]+@gmail\.com$/, "Email must be a valid Gmail address")
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(1, "Password is required")
      .min(5, "Password must be at least 5 characters")
  });

// Schema untuk Edit Profile
export const profileSchema = z.object({
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
    old_password: z
      .string()
      .min(1, "Old password is required")
      .min(5, "Old password must be at least 5 characters"),
    new_password: z
      .string()
      .min(1, "New password is required")
      .min(5, "New password must be at least 5 characters"),
    new_password_confirm: z
      .string()
      .min(1, "New password confirmation is required")
      .min(5, "New password confirmation must be at least 5 characters")
  })
  .refine(data => data.new_password === data.new_password_confirm, {
    message: "New passwords do not match",
    path: ["new_password_confirm"]
  });