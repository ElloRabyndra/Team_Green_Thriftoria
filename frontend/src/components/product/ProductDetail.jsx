import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Heart,
  Share2,
  Eye,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import Empty from "../ui/Empty";

export default function ProductDetail() {
  const { id } = useParams();
  const userRole = id % 2 !== 0 ? "seller" : "buyer"; // Sementara
  const navigate = useNavigate();
  const { products, loading, addToCart } = useOutletContext();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(
        (product) => product.id === parseInt(id)
      );
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [id, products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 15000);
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
      <div className="flex flex-wrap justify-center gap-0 md:gap-6 xl:mt-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="overflow-hidden w-60 sm:w-80 lg:w-96 p-0">
            <img
              src={product.thumbnail}
              alt={product.title}
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
          {/* Product Title and Category */}
          <div>
            <span className="text-sm text-gray-500 uppercase font-medium">
              {product.category.replace("-", " ")}
            </span>
            <h1 className="text-2xl md:text-2xl font-bold mt-1">
              {product.title}
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
          {userRole === "buyer" && (
            <div className="space-y-3 mt-5">
              <Button
                onClick={() => addToCart(product)}
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
