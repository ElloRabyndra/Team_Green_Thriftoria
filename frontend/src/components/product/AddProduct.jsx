import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "./Schema";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

export default function AddProduct() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { products, loading, addToCart } = useOutletContext();
  const [previewImage, setPreviewImage] = useState(null);

  // State untuk menyimpan nilai yang diformat untuk tampilan
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedStock, setFormattedStock] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      label: "",
      title: "",
      price: "",
      stock: "",
      category: "fashion",
      description: "",
    },
  });

  const nameInputRef = useRef(null);

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  // Focus ke input title saat component mount
  useEffect(() => {
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, []);

  const formatPrice = (value) => {
    if (!value && value !== 0) return "";

    // Convert ke string jika berupa number
    const stringValue = value.toString();

    // Hapus semua karakter non-digit
    const numericValue = stringValue.replace(/\D/g, "");

    // Format dengan titik sebagai pemisah ribuan
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fungsi untuk menghapus format (titik) dan mendapatkan nilai asli
  const removeFormat = (value) => {
    if (!value) return "";
    return value.toString().replace(/\./g, "");
  };

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = removeFormat(inputValue);
    const formattedValue = formatPrice(numericValue);

    // Update tampilan
    setFormattedPrice(formattedValue);
    // Update nilai form dengan nilai asli (tanpa format)
    setValue("price", numericValue);
  };

  const handleStockChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = removeFormat(inputValue);
    const formattedValue = formatPrice(numericValue);

    // Update tampilan
    setFormattedStock(formattedValue);
    // Update nilai form dengan nilai asli (tanpa format)
    setValue("stock", numericValue);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validasi file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, JPG, PNG)");
        // Reset input file
        e.target.value = "";
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        // Reset input file
        e.target.value = "";
        return;
      }

      // Jika validasi berhasil, update preview
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    toast.success("Product added successfully!");
    // Reset form dan preview setelah berhasil
    reset();
    setPreviewImage(null);
    setFormattedPrice("");
    setFormattedStock("");
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Product Detail */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row lg:justify-center gap-6 lg:mt-12"
      >
        {/* Product Images */}
        <div className="relative group flex justify-center">
          {/* Main Image or Upload Placeholder */}
          <div className="overflow-hidden w-full max-w-sm max-h-96 sm:w-80 lg:w-96 rounded-2xl bg-card/70 flex items-center justify-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Product Preview"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/500x500?text=No+Image";
                }}
              />
            ) : (
              <label
                htmlFor="thumbnail"
                className="flex flex-col items-center justify-center w-full h-96 cursor-pointer bg-transparent hover:bg-card/90 transition-colors"
              >
                <Upload className="h-16 w-16 text-gray-400 mb-4" />
                <span className="text-gray-500 text-center px-4">
                  Click to upload product image
                  <br />
                  <span className="text-sm text-gray-400">
                    (JPEG, JPG, PNG - Max 5MB)
                  </span>
                </span>
              </label>
            )}
          </div>

          {/* Overlay untuk edit gambar jika sudah ada preview */}
          {previewImage && (
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
              <label
                htmlFor="thumbnail"
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200 hover:shadow-xl cursor-pointer"
                title="Change Product Image"
              >
                <Upload className="h-5 w-5" />
              </label>
            </div>
          )}

          <input
            {...register("thumbnail")}
            id="thumbnail"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Product Information */}
        <div className="space-y-3 lg:max-w-md w-full">
          {/* Product Title and Category */}
          <div className="flex flex-col w-full">
            <input
              {...register("label")}
              id="label"
              type="text"
              placeholder="Insert Label..."
              autoComplete="off"
              className="text-sm text-gray-500 uppercase font-medium border-none outline-none w-full bg-transparent"
            />
            <input
              {...register("title")}
              ref={nameInputRef}
              id="title"
              type="text"
              placeholder="Insert Title..."
              autoComplete="off"
              className="text-xl sm:text-2xl font-bold mt-1 border-none outline-none w-full bg-transparent"
            />
          </div>

          {/* Price */}
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                Rp
              </span>
              <input
                id="price-display"
                type="text"
                placeholder="Insert Price..."
                autoComplete="off"
                value={formattedPrice}
                onChange={handlePriceChange}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary border-none outline-none flex-1 bg-transparent min-w-0"
              />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="font-medium whitespace-nowrap">Stock:</span>
              <input
                id="stock-display"
                type="text"
                placeholder="Insert Stock..."
                autoComplete="off"
                value={formattedStock}
                onChange={handleStockChange}
                className="border-none outline-none flex-1 bg-transparent min-w-0"
              />
            </div>
          </div>

          {/* Category */}
          <div className="w-full flex gap-2 items-center text-sm text-gray-600 mb-0.5">
            <h3 className="font-medium mb-2">Category: </h3>
            <div className="flex gap-4 mb-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("category")}
                  type="radio"
                  value="fashion"
                  defaultChecked
                  className="accent-primary text-primary"
                />
                <span className="text-gray-700">Fashion</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("category")}
                  type="radio"
                  value="others"
                  className="accent-primary text-primary"
                />
                <span className="text-gray-700">Others</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Description:</h3>
            <textarea
              {...register("description")}
              id="description"
              placeholder="Insert Description..."
              autoComplete="off"
              className="w-full text-gray-500 leading-relaxed border-none outline-none resize-none"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          {user?.role === "seller" && (
            <div className="space-y-3 mt-6 w-full">
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 h-12 text-base cursor-pointer"
              >
                <Save className="h-5 w-5" />
                Add Product
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
