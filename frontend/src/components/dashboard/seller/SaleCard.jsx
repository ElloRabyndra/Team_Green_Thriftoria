import { Clock, Store, Package, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

// SaleCard Component
const SaleCard = ({ sale }) => {
  // Fungsi untuk format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 15000);
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

  const currentStatus =
    statusConfig[sale.statusShipping] || statusConfig.awaitingPayment;

  return (
    <Link to={`/dashboard/sale/${sale.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="px-4 py-0 sm:py-1">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 pb-4 border-b border-border">
            <div className="flex-1 min-w-0 -mt-1">
              <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                {sale.recepient}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {sale.telephone}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
              <Clock className="h-4 w-4" />
              <span>{formatDate(sale.orderDate)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>
                  {sale.totalItems} Item{sale.totalItems > 1 ? "s" : ""}
                </span>
              </div>
              <span className="font-semibold text-base sm:text-lg text-primary">
                {formatPrice(sale.totalPrice)}
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

export default SaleCard