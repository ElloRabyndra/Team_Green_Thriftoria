import { z } from "zod";

// Fungsi ini menerima 'fileList' (Filelist dari input) atau undefined/null
const fileRefinementBase = z
  .any()
  // KRUSIAL: Pengecekan pertama untuk tipe data: hanya izinkan FileList atau undefined.
  // Jika field ini opsional dan tidak diisi, nilainya adalah FileList (length 0) atau undefined.
  .refine(
    (val) => !val || val instanceof FileList,
    "Input must be a File List object."
  )
  // KRUSIAL: Pengecekan 2: Size (Batasan 5MB untuk basis)
  .refine(
    // Kita cek item pertama (file) di FileList. Jika fileList kosong, val?.[0] adalah undefined.
    (fileList) => !fileList?.[0] || fileList?.[0].size <= 5 * 1024 * 1024,
    "File size must not exceed 5MB"
  )
  // Pengecekan 3: Tipe file
  .refine(
    (fileList) =>
      !fileList?.[0] ||
      ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        fileList?.[0].type
      ),
    "Image must be PNG, JPG, JPEG, or WEBP format"
  );

export const addProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be at most 100 characters"),

  label: z
    .string()
    .min(1, "Label is required")
    .min(3, "Label must be at least 3 characters"),

  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^[0-9]+$/, "Price must contain only digits"),

  stock: z
    .string()
    .min(1, "Stock is required")
    .regex(/^[0-9]+$/, "Stock must contain only digits"),

  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),

  // KRUSIAL UNTUK ADD PRODUCT: Image wajib ada (length > 0)
  image: fileRefinementBase
    // Validasi Wajib: Pastikan ada minimal 1 file
    .refine((fileList) => fileList?.length > 0, "Product image is required")
    // Validasi 1MB: Override batasan size base
    .refine(
      (fileList) => !fileList?.[0] || fileList?.[0].size <= 1 * 1024 * 1024,
      "Image size must be less than 1MB"
    ),
});

export const editProductSchema = z
  .object({
    name: z.string().min(3).max(100).optional(),
    label: z.string().min(3).optional(),
    price: z
      .string()
      .regex(/^[0-9]+$/, "Price must contain only digits")
      .optional(),
    stock: z
      .string()
      .regex(/^[0-9]+$/, "Stock must contain only digits")
      .optional(),
    category: z.string().min(1).optional(),
    description: z.string().min(1).optional(),

    // Image opsional, jika ada, terapkan validasi 1MB.
    image: fileRefinementBase
      .optional()
      .refine(
        (fileList) =>
          !fileList || !fileList?.[0] || fileList?.[0].size <= 1 * 1024 * 1024,
        "Image size must be less than 1MB"
      ),
  })
  .partial();
