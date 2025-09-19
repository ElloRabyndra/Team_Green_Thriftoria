import { ShoppingCart, Eye, Edit3 } from "lucide-react";
import { Card } from "../ui/card";
import { Link } from "react-router";

// ProductCard Component
export default function ProductCard({ 
  product, 
  onAddToCart, 
  userRole = "buyer", // Default role adalah buyer
}) {
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price * 15000); 
  };
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
      {userRole === "seller" ? (
      <Link to={`/edit-product/${product.id}`} className="relative overflow-hidden group block">
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
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
      <Link to={`/product/${product.id}`} className="relative overflow-hidden group block">
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </Link>
      )}

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase font-medium">
            {product.category.replace("-", " ")}
          </span>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="mb-2">
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Tombol berbeda berdasarkan role */}
        {userRole === "buyer" ? (
          <button 
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">
              Add to Cart
            </span>
          </button>
        ) : (
          <div className="flex gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">
                View Details
              </span>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}