import { ShoppingCart, Eye, Edit3, X } from "lucide-react";
import { Card } from "../ui/card";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../ui/ConfirmDialog";

// ProductCard Component
export default function ProductCard({
  product,
  onAddToCart = async () => {},
  onRemoveProduct = async () => {},
  cartLoading,
  role = "buyer",
  shop_id = null,
}) {
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    const response = await onAddToCart(product);

    if (response.success) {
      toast.success(response.message || "Product added to cart!");
    } else {
      toast.error(response.message || "Failed to add product to cart");
    }
  };

  const handleDeleteProduct = async (product_id) => {
    const response = await onRemoveProduct(product_id);
    if (response.success) {
      toast.success("Product deleted successfully!");
    } else {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="relative group">
      {role === "seller" && product.shop_id === shop_id && (
        <ConfirmDialog
          onConfirm={() => {
            handleDeleteProduct(product.id);
          }}
        >
          <button
            className="absolute -top-1 -right-2 z-10 bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
            title="Cancel Order"
          >
            <X className="h-4 w-4" />
          </button>
        </ConfirmDialog>
      )}
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 max-w-64 sm:max-w-full sm:w-full gap-0 sm:gap-4 pb-0 sm:pb-4">
        {role === "seller" && product.shop_id === shop_id ? (
          <Link
            to={`/dashboard/edit-product/${product.id}`}
            className="relative overflow-hidden group block"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-20 sm:h-48 object-cover transition-transform duration-300"
              onError={(e) => {
                e.target.src =
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              }}
            />

            {/* Overlay untuk role penjual dengan tombol edit */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200 hover:shadow-xl cursor-pointer"
                title="Edit Product"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>
          </Link>
        ) : (
          <Link
            to={`/product/${product.id}`}
            className="relative overflow-hidden group block"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-20 sm:h-48 object-cover transition-transform duration-300"
              onError={(e) => {
                e.target.src =
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
              }}
            />
          </Link>
        )}

        <div className="p-4">
          <div className="mb-2">
            <span className="hidden sm:block text-xs text-gray-500 uppercase font-medium">
              {product.label}
            </span>
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="mb-2">
            <p className="text-xs text-gray-600 line-clamp-1 sm:line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Tombol berbeda berdasarkan role */}
          {(role === "seller" && product.shop_id !== shop_id) ||
          role === "buyer" ? (
            <button
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-1 sm:px-4 rounded-lg transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => handleAddToCart()}
              disabled={cartLoading || product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">
                Add to Cart
              </span>
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 pxpx-4 rounded-lg transition-all duration-200"
              >
                <Eye className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">
                  View Details
                </span>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
