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
    username: z
      .string()
      .min(1, "Username is required")
      .min(4, "Username must be at least 4 characters"),
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
  profilePicture: z
    .any()
    .optional()
    .refine(
      (file) => !file || file instanceof File,
      { message: "Invalid file" }
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      { message: "File size must not exceed 5MB" }
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Only JPG and PNG formats are allowed" }
    ),
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
    username: z
      .string()
      .min(1, "Username is required")
      .min(4, "Username must be at least 4 characters"),
    telephone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits"),
    address: z
      .string()
      .min(1, "Address is required")
      .min(5, "Address must be at least 5 characters"),
    old_password: z.string().optional().or(z.literal("")),
    new_password: z.string().optional().or(z.literal("")),
    new_password_confirm: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Kalau salah satu password diisi, semua wajib diisi
      if (data.old_password || data.new_password || data.new_password_confirm) {
        return (
          data.old_password.trim() !== "" &&
          data.new_password.trim() !== "" &&
          data.new_password_confirm.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "All password fields are required when changing password",
      path: ["old_password"],
    }
  )
  .refine(
    (data) => {
      if (data.new_password && data.new_password_confirm) {
        return data.new_password === data.new_password_confirm;
      }
      return true;
    },
    {
      message: "New passwords do not match",
      path: ["new_password_confirm"],
    }
  );