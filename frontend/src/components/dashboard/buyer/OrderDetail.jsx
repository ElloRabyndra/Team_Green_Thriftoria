import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Phone, ShoppingBag, Store, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { sampleOrders, orderItems } from "@/database/dummy";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [currentOrderItem, setCurrentOrderItem] = useState([]);

  // Ambil detail order dan item
  useEffect(() => {
    if (!orderId) return;

    const id = Number(orderId);
    const foundOrder = sampleOrders.find((order) => order.id === id);
    const items = orderItems.filter((item) => item.orderId === id);

    if (foundOrder) {
      setOrder(foundOrder);
      setCurrentOrderItem(items);
    }

    console.log("foundOrder:", foundOrder);
    console.log("items:", items);
  }, [orderId]);

  // Redirect jika bukan buyer atau seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "buyer" && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Konfigurasi status
  const statusConfig = {
    awaitingPayment: {
      label: "Awaiting Payment",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    prepared: {
      label: "Prepared",
      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    },
    shipped: {
      label: "Shipped",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    delivered: {
      label: "Delivered",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    cancelPending: {
      label: "Cancel Pending",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };
  if (!order) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading order details...
      </div>
    );
  }

  return (
    <section className="space-y-4 md:ml-4">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Order Info */}
        <main className="w-full xl:w-1/2">
          <Card className="w-full min-w-80 md:min-w-96">
            <CardHeader className="flex items-center justify-between gap-2">
              <CardTitle>Order Information</CardTitle>
              {/* Tombol Cancel hanya muncul jika statusShipping bukan cancelled atau cancelPending */}
              {order.statusShipping !== "cancelled" &&
                order.statusShipping !== "cancelPending" &&
                order.statusShipping !== "delivered" && (
                  <button className="text-sm hover:text-red-400 hover:underline cursor-pointer">
                    Cancel Order
                  </button>
                )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Recepient */}
                <div>
                  <p className="text-sm text-muted-foreground">Recepient:</p>
                  <p className="font-medium">{order.recepient}</p>
                </div>
                {/* Telephone */}
                <div>
                  <p className="text-sm text-muted-foreground">Telephone:</p>
                  <p className="font-medium">{order.telephone}</p>
                </div>
                {/* Shipping Address */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Shipping Address:
                  </p>
                  <p className="font-medium">{order.address}</p>
                </div>
                {/* Note */}
                <div>
                  <p className="text-sm text-muted-foreground">Note:</p>
                  <p className="font-medium max-w-sm">{order.note}</p>
                </div>
                {/* Order Date */}
                <div>
                  <p className="text-sm text-muted-foreground">Order Date:</p>
                  <p className="font-medium">{formatDate(order.orderDate)}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      statusConfig[order.statusShipping].color
                    }`}
                  >
                    <span>{statusConfig[order.statusShipping].label}</span>
                  </span>

                  {/* Jika status cancelPending dan dibatalkan oleh seller */}
                  {order.statusShipping === "cancelPending" &&
                    order.cancelBy === "seller" && (
                      <div className="flex items-center gap-1 ml-2">
                        {/* Tombol Setuju */}
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                          <Check size={16} />
                        </button>

                        {/* Tombol Tolak */}
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Checkout Summary */}
        <aside className="w-full xl:w-1/2">
          <Card className="p-6 sticky top-4">
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                {/* Shop Name */}
                <Link to={`/shop/${1}`} className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Store className="h-4 w-4" />
                  <span className="font-medium capitalize">
                    {order.shopName}
                  </span>
                </Link>
                {/* Telephone */}
                <div className="flex items-center gap-2 ml-1 mt-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">
                    {order.shopPhone}
                  </span>
                </div>

                {/* Selected Items */}
                <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
                  {currentOrderItem.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48x48?text=No+Image";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.label.replace("-", " ")} • Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          {formatPrice(item.price * item.quantity * 15000)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.totalPrice * 15000 - 30000)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">{formatPrice(30000)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.totalPrice * 15000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </section>
  );
};

export default OrderDetail;
