import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "./Schema";
import { ArrowLeft, Edit3, Save } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    productDetail,
    getProductDetail,
    loading: productLoading,
    editExistingProduct,
  } = useProducts();
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

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") {
      navigate(-1); // kembali ke halaman sebelumnya
      // atau navigate("/products") untuk ke homepage
    }
  }, [isLoading, user, navigate]);

  // Ambil product detail
  useEffect(() => {
    if (id) getProductDetail(Number(id));
  }, [id]);

  // Set product detail
  useEffect(() => {
    if (productDetail) {
      setProduct(productDetail);

      setValue("label", productDetail.label);
      setValue("name", productDetail.name);

      const originalPrice = productDetail.price.toString();
      const originalStock = (productDetail.stock || 0).toString();

      setValue("price", originalPrice);
      setValue("stock", originalStock);
      setValue(
        "category",
        productDetail.category ? productDetail.category : "Others"
      );
      setValue("description", productDetail.description);

      setFormattedPrice(formatPrice(originalPrice));
      setFormattedStock(formatPrice(originalStock));
    }
  }, [productDetail]);

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

    setFormattedStock(formattedValue);
    setValue("stock", numericValue);
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    const file = fileList[0];

    if (!file) {
      setProduct((prev) => ({ ...prev, previewImage: undefined }));
      setValue("image", fileList, { shouldValidate: true });
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, JPG, PNG, WEBP)");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      e.target.value = "";
      return;
    }

    setProduct((prev) => ({
      ...prev,
      previewImage: URL.createObjectURL(file),
    }));

    setValue("image", fileList, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    const result = await editExistingProduct(Number(id), data);
    if (result.success) {
      toast.success("Product updated successfully!");
      navigate("/dashboard/my-products");
    }
  };

  const onError = () => {
    toast.error("Please fill all fields correctly!");
  };

  if (productLoading) {
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
            onClick={() => navigate("/dashboard/my-products")}
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
          onClick={() => navigate("/dashboard/my-products")}
          className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Product Detail */}
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col lg:flex-row lg:justify-center gap-6 lg:mt-12"
      >
        {/* Product Images */}
        <div className="relative group flex justify-center">
          {/* Main Image */}
          <div className="overflow-hidden w-full max-w-sm max-h-96 sm:w-80 lg:w-96 rounded-2xl">
            <img
              src={
                product.previewImage || product.image // jika ada preview baru, pakai itu
              }
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              }}
            />
          </div>

          {/* Overlay untuk role penjual dengan tombol edit (input file) */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
            <label
              htmlFor="image"
              className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200 hover:shadow-xl cursor-pointer"
              title="Edit Product Image"
            >
              <Edit3 className="h-5 w-5" />
            </label>
            <input
              id="image"
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
              {...register("name")}
              id="name"
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
                  value="Fashion"
                  className="accent-primary text-primary"
                />
                <span className="text-gray-700">Fashion</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("category")}
                  type="radio"
                  value="Others"
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
