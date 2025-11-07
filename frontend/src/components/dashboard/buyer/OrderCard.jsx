import { Clock, Store, Package, X, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// OrderCard Component
export default function OrderCard({ order }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

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

  const handleShopClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shop/${order.shop_id}`);
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

  const currentStatus =
    statusConfig[order.status_shipping] || statusConfig.awaitingPayment;

  return (
    <Link to={`/dashboard/order/${order.order_id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="px-4 py-0 sm:py-1">
          {/* Header Section */}
          <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-border">
            {/* Store Info - clickable */}
            <div
              onClick={handleShopClick}
              className="flex items-center gap-2 hover:text-primary transition-colors w-fit cursor-pointer"
            >
              <Store className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground hover:text-primary transition-colors">
                {order.shop_name}
              </span>
            </div>
            {/* Telephone */}
            <div className="flex items-center gap-2 ml-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="text-xs text-muted-foreground">
                {order.shop_phone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground shrink-0 mb-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(order.created_at)}</span>
          </div>

          {/* Order Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>
                  {order.product_count} Item{order.product_count > 1 ? "s" : ""}
                </span>
              </div>
              <span className="font-semibold text-base sm:text-lg text-primary">
                {formatPrice(order.total_price)}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-end">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${currentStatus.color}`}
            >
              <span>{currentStatus.label}</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
