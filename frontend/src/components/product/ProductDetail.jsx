import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { getDetailProduct } from "@/service/dummyApi";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response = await getDetailProduct(parseInt(id));
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product);
    if (success) {
      toast.success("Product added to cart!");
    } else {
      toast.error("Failed to add product to cart");
    }
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
    <div>
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

      {/* Product Detail */}
      <div className="flex flex-wrap justify-center gap-0 md:gap-20 xl:mt-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="overflow-hidden w-60 sm:w-80 lg:w-96 p-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-3 md:max-w-md px-6">
          {/* Product Name and Label */}
          <div>
            <span className="text-sm text-gray-500 uppercase font-medium">
              {product.label}
            </span>
            <h1 className="text-2xl md:text-2xl font-bold mt-1">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-gray-600">
              Stock:{" "}
              <span className="font-medium">{product.stock} available</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-500 leading-relaxed">
              {product.description}
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
