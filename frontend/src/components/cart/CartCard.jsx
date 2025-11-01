import { Card } from "../ui/card";
import { Plus, Minus, X, Check, Store } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export default function CartCard({
  cartItem,
  isSelected,
  onSelect,
  increaseQuantity,
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
    }).format(price);
  };

  return (
    <Card
      className={`flex gap-2 flex-row p-2 transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-primary bg-primary/5"
          : "hover:shadow-md opacity-100"
      }`}
    >
      <img
        className="w-24 md:w-28 object-cover rounded-md"
        src={cartItem.image}
        alt={cartItem.name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/120x120?text=No+Image";
        }}
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-sm md:text-base font-semibold max-w-32 sm:max-w-full xl:max-w-48 truncate">
            {cartItem.name}
          </h2>
          <p className="text-sm text-muted-foreground capitalize font-medium">
            {cartItem.label}
          </p>
          <p className="flex gap-2 items-center text-muted-foreground text-sm font-medium capitalize">
            <Store className="h-4 w-4" />
            {cartItem.shop_name}
          </p>
        </div>
        <p className="text-sm font-semibold md:text-base text-primary">
          {formatPrice(cartItem.price * cartItem.quantity)}
        </p>
      </div>
      <div className="flex flex-col justify-between items-end ml-auto">
        <div className="flex items-center gap-2">
          {/* Selection Button */}
          <button
            onClick={() => onSelect(cartItem.id)}
            className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isSelected
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary"
            }`}
            title={isSelected ? "Selected" : "Select this item"}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </button>

          {/* Remove Button */}
          <ConfirmDialog onConfirm={() => removeFromCart(cartItem.id)}>
            <button
              className="text-muted-foreground hover:text-destructive transition-colors duration-200"
              title="Remove from cart"
            >
              <X className="h-4 w-4" />
            </button>
          </ConfirmDialog>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center">
          <button
            onClick={() => decreaseQuantity(cartItem)}
            className="rounded-md p-1 cursor-pointer"
          >
            <Minus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <span className="px-1 text-sm md:text-base font-medium">
            {cartItem.quantity}
          </span>
          <button
            onClick={() => increaseQuantity(cartItem)}
            className="rounded-md p-1 cursor-pointer"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
