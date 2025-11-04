import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductSchema } from "./Schema";
import { ArrowLeft, Edit3, Save, Upload } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

export default function AddProduct() {
  const { user, isLoading } = useAuth();
  const { addNewProduct, loading: productLoading } = useProducts();
  const navigate = useNavigate();
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
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      label: "",
      name: "",
      price: "",
      stock: "",
      category: "fashion",
      description: "",
    },
  });

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  const formatPrice = (value) => {
    if (!value && value !== 0) return "";
    const stringValue = value.toString();
    const numericValue = stringValue.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const removeFormat = (value) => {
    if (!value) return "";
    return value.toString().replace(/\./g, "");
  };

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = removeFormat(inputValue);
    const formattedValue = formatPrice(numericValue);
    setFormattedPrice(formattedValue);
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
    const file = e.target.files[0];
    const fileList = e.target.files;

    if (!file) {
      setPreviewImage(null);
      setValue("image", fileList);
      return;
    }

    // Validasi Client-Side
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, JPG, PNG, WEBP)");
      e.target.value = "";
      setPreviewImage(null);
      return;
    }

    setPreviewImage(URL.createObjectURL(file));

    setValue("image", fileList, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);

    const result = await addNewProduct({
      shop_id: user.Shop?.id || user.id, // nanti ganti ke user.Shop.id
      ...data,
    });

    if (result.success) {
      toast.success("Product added successfully!");
      reset();
      setPreviewImage(null);
      setFormattedPrice("");
      setFormattedStock("");
      navigate("/dashboard/my-products");
    } else {
      toast.error("Failed to add product");
    }
  };

  const onError = () => {
    toast.error("Please fill all fields correctly!");
  };

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
          {/* Main Image or Upload Placeholder */}
          <div
            className={`${
              previewImage ? "" : "bg-card/70"
            } overflow-hidden w-full max-w-sm max-h-96 sm:w-80 lg:w-96 rounded-2xl flex items-center justify-center`}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Product Preview"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
                }}
              />
            ) : (
              <label
                htmlFor="image"
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
                htmlFor="image"
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200 hover:shadow-xl cursor-pointer"
                title="Change Product Image"
              >
                <Upload className="h-5 w-5" />
              </label>
            </div>
          )}

          <input
            id="image"
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
              {...register("name")}
              id="name"
              type="text"
              placeholder="Insert Name..."
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
                  defaultChecked
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
          {user?.role === "seller" && (
            <div className="space-y-3 mt-6 w-full">
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 h-12 text-base cursor-pointer"
              >
                <Save className="h-5 w-5" />
                {productLoading ? "Saving..." : "Save Product"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
