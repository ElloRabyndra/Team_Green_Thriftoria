import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Phone, Store, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useOrders } from "@/hooks/useOrders";
import Loading from "@/components/ui/loading";
import Empty from "@/components/ui/Empty";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { orderId } = useParams();

  // Ambil data dan fungsi dari useOrders
  const {
    orderDetail,
    fetchOrderDetail,
    approveCancel,
    denyCancel,
    requestCancel,
    loading: orderLoading,
    resetOrderDetail,
  } = useOrders();

  // Ambil detail order saat orderId berubah
  useEffect(() => {
    if (orderId) fetchOrderDetail(Number(orderId));
  }, [orderId]);

  // Redirect jika bukan buyer/seller atau orderDetail tidak ada
  useEffect(() => {
    if (!isLoading && user && user.role !== "buyer" && user.role !== "seller")
      navigate(-1);
  }, [isLoading, user, navigate]);

  if (orderLoading && !orderDetail) {
    return <Loading />;
  }

  if (!orderDetail) {
    return (
      <>
        {/* Back Button */}
        <div className="mb-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <Empty>No order found</Empty>
      </>
    );
  }
  // Fungsi format harga dan tanggal
  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));

  // fungsi cek role yang request cancel
  const cancelRole = (orderDetail, user) => {
    user.role === "seller"
      ? orderDetail.shop_id === user.id
        ? "seller"
        : "buyer"
      : "buyer";
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

  const handleRequestCancel = async (order_id, role, user_id) => {
    await requestCancel(order_id, role, user_id);
    await fetchOrderDetail(order_id);
  };

  const handleApproveCancel = async (order_id, user_id) => {
    await approveCancel(order_id, user_id);
    await fetchOrderDetail(order_id);
    toast.success("Order cancelled successfully!");
  };

  const handleDenyCancel = async (order_id, user_id) => {
    await denyCancel(order_id, user_id);
    await fetchOrderDetail(order_id);
    toast.success("Cancel request denied!");
  };
  return (
    <section className="space-y-4 md:ml-4">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
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
              {/* Tombol Cancel hanya muncul jika status_shipping bukan cancelled atau cancelPending */}
              {orderDetail.status_shipping !== "cancelled" &&
                orderDetail.status_shipping !== "cancelPending" &&
                orderDetail.status_shipping !== "delivered" && (
                  <ConfirmDialog
                    onConfirm={() =>
                      handleRequestCancel(
                        orderDetail.id,
                        cancelRole(orderDetail, user),
                        user.id
                      )
                    }
                  >
                    <button className="text-sm hover:text-red-400 hover:underline cursor-pointer">
                      Cancel Order
                    </button>
                  </ConfirmDialog>
                )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Recipient */}
                <div>
                  <p className="text-sm text-muted-foreground">Recipient:</p>
                  <p className="font-medium">{orderDetail.recipient}</p>
                </div>
                {/* Telephone */}
                <div>
                  <p className="text-sm text-muted-foreground">Telephone:</p>
                  <p className="font-medium">{orderDetail.telephone}</p>
                </div>
                {/* Shipping Address */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Shipping Address:
                  </p>
                  <p className="font-medium">{orderDetail.address}</p>
                </div>
                {/* Note */}
                <div>
                  <p className="text-sm text-muted-foreground">Note:</p>
                  <p className="font-medium max-w-sm">{orderDetail.note}</p>
                </div>
                {/* Order Date */}
                <div>
                  <p className="text-sm text-muted-foreground">Order Date:</p>
                  <p className="font-medium">
                    {formatDate(orderDetail.created_at)}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      statusConfig[orderDetail.status_shipping].color
                    }`}
                  >
                    <span>
                      {statusConfig[orderDetail.status_shipping].label}
                    </span>
                  </span>

                  {/* Jika status cancelPending dan dibatalkan oleh seller */}
                  {orderDetail.status_shipping === "cancelPending" &&
                    ((orderDetail.cancelBy === "seller" &&
                      orderDetail.shop_id !== user.id) || //  nanti ganti ke user.shop jadi user.shop_id
                      (orderDetail.cancelBy === "seller" &&
                        user.role === "buyer")) && (
                      <div className="flex items-center gap-1 ml-2">
                        {/* Tombol Setuju */}
                        <ConfirmDialog
                          onConfirm={() =>
                            handleApproveCancel(orderDetail.id, user.id)
                          }
                        >
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                            <Check size={16} />
                          </button>
                        </ConfirmDialog>

                        {/* Tombol Tolak */}
                        <ConfirmDialog
                          onConfirm={() =>
                            handleDenyCancel(orderDetail.id, user.id)
                          }
                        >
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                            <X size={16} />
                          </button>
                        </ConfirmDialog>
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
                <Link
                  to={`/shop/${1}`}
                  className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Store className="h-4 w-4" />
                  <span className="font-medium capitalize">
                    {orderDetail.shop_name}
                  </span>
                </Link>
                {/* Telephone */}
                <div className="flex items-center gap-2 ml-1 mt-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">
                    {orderDetail?.shop_telephone}
                  </span>
                </div>

                {/* Selected Items */}
                <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
                  {orderDetail?.orderItems.map((item) => (
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
                          {item.label} • Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          {formatPrice(item.price * item.quantity)}
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
                    {formatPrice(orderDetail?.total_price - 30000)}
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
                      {formatPrice(orderDetail?.total_price)}
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
