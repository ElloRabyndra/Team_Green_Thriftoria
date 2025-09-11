import { Card } from "../ui/card";
import { Plus, Minus, X } from "lucide-react";

export default function CartCard({
  product,
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
    <Card className="flex gap-2 flex-row p-2">
      <img
        className="w-24 md:w-28 object-cover"
        src={product.thumbnail}
        alt={product.title}
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-sm md:text-base font-semibold max-w-32 sm:max-w-full xl:max-w-48 truncate">
            {product.title}
          </h2>
          <p className="text-sm text-gray-500 capitalize font-medium">
            {product.category.replace("-", " ")}
          </p>
        </div>
        <p className="text-sm font-semibold md:text-base">
          {formatPrice(product.price * product.quantity)}
        </p>
      </div>
      <div className="flex flex-col justify-between items-end ml-auto">
        <button onClick={() => removeFromCart(product)}>
          <X className="h-4 w-4 cursor-pointer hover:text-red-400" />
        </button>
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
    </Card>
  );
}
