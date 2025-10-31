import { z } from "zod";

// Schema untuk registrasi
export const registerSchema = z
  .object({
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
      .min(5, "Password confirmation must be at least 5 characters"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
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
    .min(5, "Password must be at least 5 characters"),
});

// Schema untuk Edit Profile
export const profileSchema = z
  .object({
    profile_picture: z
      .any()
      .optional() // Tetap optional, mengizinkan undefined saat tidak ada update file
      .refine((file) => !file || file instanceof File, {
        message: "Invalid file type",
      })
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "File size must not exceed 5MB",
      })
      .refine(
        (
          file // Perbaiki pesan error agar sesuai dengan yang diizinkan (termasuk WEBP)
        ) =>
          !file ||
          ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            file.type
          ),
        { message: "Only JPG, PNG, JPEG, WEBP formats are allowed" }
      ),

    // Email dan Username tetap required (karena harus selalu ada di profile)
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

    // KRUSIAL: telephone HARUS DIUBAH agar menerima string kosong ("") yang mungkin
    // menjadi nilai default saat pertama load dari database.
    telephone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (val === undefined || val === "") return true; // Lulus jika kosong
        return /^[0-9]+$/.test(val) && val.length >= 10;
      }, "Phone number must be at least 10 digits and contain only digits"),

    // KRUSIAL: address HARUS DIUBAH agar menerima string kosong ("")
    address: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (val === undefined || val === "") return true; // Lulus jika kosong
        return val.length >= 5;
      }, "Address must be at least 5 characters"),

    old_password: z.string().optional().or(z.literal("")),
    new_password: z.string().optional().or(z.literal("")),
    new_password_confirm: z.string().optional().or(z.literal("")),
  })
  .refine(
    // ... (Logika validasi password tetap sama)
    (data) => {
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
