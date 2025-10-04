import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "./Schema";
import { ArrowLeft, Edit3, Save } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { products, loading, addToCart } = useOutletContext();
  const [product, setProduct] = useState(null);

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
  });

  const nameInputRef = useRef(null);

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") {
      navigate(-1); // kembali ke halaman sebelumnya
      // atau navigate("/") untuk ke homepage
    }
  }, [isLoading, user, navigate]);

  // Set product ketika id berubah
  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(
        (product) => product.id === parseInt(id)
      );
      if (foundProduct) {
        setProduct(foundProduct);

        // Set form values setelah product ditemukan
        setValue("label", foundProduct.category.replace("-", " "));
        setValue("title", foundProduct.title);

        // Set nilai asli untuk form (tanpa format)
        const originalPrice = (foundProduct.price * 15000).toString();
        const originalStock = (foundProduct.stock || 0).toString();

        setValue("price", originalPrice);
        setValue("stock", originalStock);
        setValue("category", foundProduct.category ? "others" : "fashion");
        setValue("description", foundProduct.description);

        // Set nilai yang diformat untuk tampilan
        setFormattedPrice(formatPrice(originalPrice));
        setFormattedStock(formatPrice(originalStock));

        setTimeout(() => {
          // set defaut value title
          nameInputRef.current.value = foundProduct.title;
          nameInputRef.current?.focus();
        }, 100);
      }
    }
  }, [id, products]);

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
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
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
      setProduct((prev) => ({
        ...prev,
        previewImage: URL.createObjectURL(file), // preview sementara
      }));
    }
  };

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    toast.success("Product updated successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        {/* Back Button */}
        <div className="mb-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>
        <Empty>No product found</Empty>
      </>
    );
  }

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
          {/* Main Image */}
          <div className="overflow-hidden w-full max-w-sm max-h-96 sm:w-80 lg:w-96 rounded-2xl">
            <img
              src={
                product.previewImage || product.thumbnail // jika ada preview baru, pakai itu
              }
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </div>

          {/* Overlay untuk role penjual dengan tombol edit (input file) */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
            <label
              htmlFor="thumbnail"
              className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200 hover:shadow-xl cursor-pointer"
              title="Edit Product Image"
            >
              <Edit3 className="h-5 w-5" />
            </label>
            <input
              {...register("thumbnail")}
              id="thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
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
          {user.role === "seller" && (
            <div className="space-y-3 mt-6 w-full">
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 h-12 text-base cursor-pointer"
              >
                <Save className="h-5 w-5" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
