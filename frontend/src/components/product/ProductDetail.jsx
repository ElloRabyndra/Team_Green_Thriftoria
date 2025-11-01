import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    productDetail,
    getProductDetail,
    loading: productLoading,
    addToCart,
  } = useProducts();

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Ambil data produk
  useEffect(() => {
    if (id) getProductDetail(Number(id));
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      console.error("User not logged in");
      toast.error("Please login first");
      return;
    }
    const success = await addToCart(user.id, product);
    if (success) {
      toast.success("Product added to cart!");
    } else {
      toast.error("Failed to add product to cart");
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loading />
      </div>
    );
  }

  if (!productDetail) {
    return (
      <>
        {/* Back Button */}
        <div className="mb-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
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
    <div>
      {/* Back Button */}
      <div className="mb-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Product Detail */}
      <div className="flex flex-wrap justify-center gap-0 md:gap-20 xl:mt-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="overflow-hidden w-60 sm:w-80 lg:w-96 p-0">
            <img
              src={productDetail.image}
              alt={productDetail.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-3 md:max-w-md px-6">
          {/* Product Name and Label */}
          <div>
            <span className="text-sm text-gray-500 uppercase font-medium">
              {productDetail.label}
            </span>
            <h1 className="text-2xl md:text-2xl font-bold mt-1">
              {productDetail.name}
            </h1>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {formatPrice(productDetail.price)}
            </div>
            <div className="text-sm text-gray-600">
              Stock:{" "}
              <span className="font-medium">
                {productDetail.stock} available
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-500 leading-relaxed">
              {productDetail.description}
            </p>
          </div>

          {/* Action Buttons */}
          {user.role === "buyer" && (
            <div className="space-y-3 mt-5">
              <Button
                onClick={() => handleAddToCart()}
                className="w-full flex items-center justify-center gap-2 h-12 text-base cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
