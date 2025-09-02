import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function CartDetail({ totalPrice }) {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 15000);
  };

  const handleCheckout = () => {
    setIsOrderPlaced(true);
    toast.success("Order placed successfully!");
  };
  return (
    <>
      <Card className="px-4 gap-2">
        <h2 className="text-lg font-semibold">Cart Detail</h2>
        <div className="flex justify-between font-medium text-gray-500">
          <p>Subtotal</p>
          <p>{formatPrice(totalPrice)}</p>
        </div>
        <div className="flex justify-between font-medium text-gray-500">
          <p>Discount (-20%)</p>
          <p className="text-red-400">-{formatPrice(totalPrice * 0.2)}</p>
        </div>
        <div className="flex justify-between font-medium text-gray-500">
          <p>Delevery Fee</p>
          <p>{formatPrice(15)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
          <p>Total</p>
          <p>{formatPrice(totalPrice + 15)}</p>
        </div>
      </Card>
      <Button
        onClick={handleCheckout}
        disabled={isOrderPlaced}
        className="w-full mt-4 cursor-pointer"
      >
        Place Order
      </Button>
    </>
  );
}
