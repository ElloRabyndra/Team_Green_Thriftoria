import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "./Schema";
import { ArrowLeft, Save, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";

export default function ProductDetail() {
  const { id } = useParams();
  const userRole = id % 2 !== 0 ? "seller" : "buyer"; // Sementara
  const navigate = useNavigate();
  const { products, loading, addToCart } = useOutletContext();
  const [product, setProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProductSchema),
  });

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(
        (product) => product.id === parseInt(id)
      );
      if (foundProduct) {
        setProduct(foundProduct);
        setTimeout(() => {
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

  const handlePriceChange = (e) => {
    const formattedValue = formatPrice(e.target.value);
    e.target.value = formattedValue;
  };

  const onSubmit = (data) => {};

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
        <div className="flex justify-center">
          {/* Main Image */}
          <div className="overflow-hidden w-full max-w-sm sm:w-80 lg:w-96">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
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
              defaultValue={product.category.replace("-", " ")}
              className="text-sm text-gray-500 uppercase font-medium border-none outline-none w-full bg-transparent"
            />
            <input
              {...register("name")}
              ref={nameInputRef}
              id="name"
              type="text"
              placeholder="Insert Name..."
              autoComplete="off"
              defaultValue={product.title}
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
                {...register("price")}
                id="price"
                type="text"
                placeholder="Insert Price..."
                autoComplete="off"
                defaultValue={formatPrice(product.price * 15000)}
                onChange={handlePriceChange}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary border-none outline-none flex-1 bg-transparent min-w-0"
              />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="font-medium whitespace-nowrap">Stock:</span>
              <input
                {...register("stock")}
                id="stock"
                type="text"
                placeholder="Insert Stock..."
                autoComplete="off"
                defaultValue={formatPrice(product.price * 15000)}
                onChange={handlePriceChange}
                className="border-none outline-none flex-1 bg-transparent min-w-0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <textarea
              {...register("description")}
              id="description"
              placeholder="Insert Description..."
              autoComplete="off"
              defaultValue={product.description}
              className="w-full text-gray-500 leading-relaxed border-none outline-none resize-none"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          {userRole === "seller" && (
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
