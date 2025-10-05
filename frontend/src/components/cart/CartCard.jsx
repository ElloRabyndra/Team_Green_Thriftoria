import { Card } from "../ui/card";
import { Plus, Minus, X, Check, Store } from "lucide-react";

export default function CartCard({
  product,
  isSelected,
  onSelect,
  addToCart,
  decreaseQuantity,
  removeFromCart,
}) {
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 15000);
  };

  return (
    <Card 
      className={`flex gap-2 flex-row p-2 transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'hover:shadow-md opacity-100'
      }`}
    >
      <img
        className="w-24 md:w-28 object-cover rounded-md"
        src={product.thumbnail}
        alt={product.title}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/120x120?text=No+Image";
        }}
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-sm md:text-base font-semibold max-w-32 sm:max-w-full xl:max-w-48 truncate">
            {product.title}
          </h2>
          <p className="text-sm text-muted-foreground capitalize font-medium">
            {product.category.replace("-", " ")}
          </p>
          <p className="flex gap-2 items-center text-muted-foreground text-sm font-medium capitalize">
            <Store className="h-4 w-4" />
            {product.shopName}
          </p>
        </div>
        <p className="text-sm font-semibold md:text-base text-primary">
          {formatPrice(product.price * product.quantity)}
        </p>
      </div>
      <div className="flex flex-col justify-between items-end ml-auto">
        <div className="flex items-center gap-2">
          {/* Selection Button */}
          <button
            onClick={() => onSelect(product.id)}
            className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isSelected
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border hover:border-primary'
            }`}
            title={isSelected ? "Selected" : "Select this item"}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </button>
          
          {/* Remove Button */}
          <button 
            onClick={() => removeFromCart(product)}
            className="text-muted-foreground hover:text-destructive transition-colors duration-200"
            title="Remove from cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Quantity Controls */}
      <div className="flex flex-col justify-between items-end ml-auto">
        <div className="flex items-center">
          <button
            onClick={() => decreaseQuantity(product)}
            className="rounded-md p-1 cursor-pointer"
          >
            <Minus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <span className="px-1 text-sm md:text-base font-medium">
            {product.quantity}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="rounded-md p-1 cursor-pointer"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
      </div>
    </Card>
  );
}