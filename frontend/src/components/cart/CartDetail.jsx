import { Link, useNavigate } from "react-router";
import { Card } from "../ui/card";
import { ShoppingBag, Store } from "lucide-react";

export default function CartDetail({ selectedItems, selectedItemsPrice }) {
  const navigate = useNavigate();
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const deliveryFee = 30000; 
  const subtotal = selectedItemsPrice;
  const total = subtotal + deliveryFee;

  // Handler untuk navigasi ke or dengan data
  const handlePlaceOrder = () => {
    navigate("/checkout", {
      state: {
        userID : 1, // Sementara
        shopID: 1, // Sementara
        selectedItems, 
        subtotal,
        deliveryFee,
        total,
        shopName: selectedItems[0]?.shopName
      }
    });
  };

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No item selected</p>
        </div>
      </Card>
    );
  }

  // Get shop name from first selected item
  const shopName = selectedItems[0]?.shopName;

  return (
    <Card className="p-6 sticky top-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Cart Summary</h2>
          
          {/* Shop Name */}
          <Link to={`/shop/${1}`} className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="h-4 w-4" />
            <span className="font-medium capitalize">{shopName}</span>
          </Link>

          {/* Selected Items */}
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.category.replace("-", " ")} • Qty: {item.quantity}
                  </p>
                  <p className="text-xs font-medium text-primary">
                    {formatPrice(item.price * item.quantity * 15000)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Items Badge */}
          <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
            <ShoppingBag className="h-3 w-3" />
            {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
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
        <button 
          onClick={handlePlaceOrder} 
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="h-5 w-5" />
          Checkout ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'})
        </button>
      </div>
    </Card>
  );
}