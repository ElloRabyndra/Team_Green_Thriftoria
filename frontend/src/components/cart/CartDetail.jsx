import { Card } from "../ui/card";
import { ShoppingBag } from "lucide-react";

export default function CartDetail({ selectedItem, selectedItemPrice }) {
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Hitung discount (contoh: 20% discount)
  const discountPercentage = 20;
  const discountAmount = selectedItemPrice * (discountPercentage / 100);
  const deliveryFee = 225000; // Fixed delivery fee
  const subtotal = selectedItemPrice;
  const total = subtotal - discountAmount + deliveryFee;

  if (!selectedItem) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No item selected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sticky top-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-2 flex items-center gap-3">
            <img
              src={selectedItem.thumbnail}
              alt={selectedItem.title}
              className="w-12 h-12 object-cover rounded-md"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
              }}
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm truncate max-w-[200px]">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {selectedItem.category.replace("-", " ")} • Qty: {selectedItem.quantity}
              </p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              Discount (-{discountPercentage}%)
            </span>
            <span className="font-medium text-destructive">
              -{formatPrice(discountAmount)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium">{formatPrice(deliveryFee)}</span>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md flex items-center justify-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Place Order
        </button>
      </div>
    </Card>
  );
}