import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Phone, Store, Check, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/loading";
import { useOrders } from "@/hooks/useOrders";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SlideIn } from "@/components/animations/SlideIn";

const SaleDetail = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { saleId } = useParams();
  const [curentStatusShipped, setCurrentStatusShipped] = useState("");
  const [proofPaymentPreview, setProofPaymentPreview] = useState(
    "https://public.bnbstatic.com/image/cms/article/body/202302/d9f75be540977a5782c30a277ff180b1.jpeg"
  );
  const [showProofPaymentPreview, setShowProofPaymentPreview] = useState(false);

  // Ambil data dan fungsi dari useOrders
  const {
    orderDetail,
    requestCancel,
    approveCancel,
    denyCancel,
    updatePaymentStatus,
    updateShippingStatus,
    fetchOrderDetail,
    loading: orderLoading,
  } = useOrders();

  // Ambil detail order saat saleId berubah
  useEffect(() => {
    if (saleId) fetchOrderDetail(Number(saleId));
  }, [saleId]);

  // set currenStatusShipped
  useEffect(() => {
    if (orderDetail) {
      setCurrentStatusShipped(orderDetail.order.status_shipping);
      setProofPaymentPreview(orderDetail.order.proof_payment);
    }
  }, [orderDetail]);

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") navigate(-1);
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
        <Empty>No Sale found</Empty>
      </>
    );
  }

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

  const handleQrisPreviewClick = () => {
    if (proofPaymentPreview) {
      setShowProofPaymentPreview(true);
    }
  };

  const handleRequestCancel = async (order_id, cancelRole) => {
    await requestCancel(order_id, cancelRole);
    await fetchOrderDetail(order_id);
  };

  const handleApprove = async (order_id, status_shipping) => {
    if (status_shipping === "cancelPending") {
      await approveCancel(order_id);
    } else if (status_shipping === "awaitingPayment") {
      await updatePaymentStatus(order_id, true);
    }
    await fetchOrderDetail(order_id);
  };

  const handleDeny = async (order_id, status_shipping) => {
    if (status_shipping === "cancelPending") {
      await denyCancel(order_id);
    } else if (status_shipping === "awaitingPayment") {
      await updatePaymentStatus(order_id, false);
    }
    await fetchOrderDetail(order_id);
  };

  const handleUpdateShippingStatus = async (order_id, status_shipping) => {
    await updateShippingStatus(order_id, status_shipping);
    await fetchOrderDetail(order_id);
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
        {/* Sale Info */}
        <main className="w-full xl:w-1/2">
          <SlideIn direction="right">
            <Card className="w-full min-w-80 md:min-w-96">
              <CardHeader className="flex items-center justify-between gap-2">
                <CardTitle>Order Information</CardTitle>
                {/* Tombol Cancel hanya muncul jika status_shipping bukan cancelled atau cancelPending */}
                {orderDetail.order.status_shipping !== "cancelled" &&
                  orderDetail.order.status_shipping !== "cancelPending" &&
                  orderDetail.order.status_shipping !== "delivered" &&
                  orderDetail.order.status_shipping !== "awaitingPayment" && (
                    <ConfirmDialog
                      onConfirm={() =>
                        handleRequestCancel(
                          orderDetail.order.order_id,
                          "seller"
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
                    <p className="font-medium">{orderDetail.order.recipient}</p>
                  </div>
                  {/* Telephone */}
                  <div>
                    <p className="text-sm text-muted-foreground">Telephone:</p>
                    <p className="font-medium">{orderDetail.order.telephone}</p>
                  </div>
                  {/* Shipping Address */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Shipping Address:
                    </p>
                    <p className="font-medium">{orderDetail.order.address}</p>
                  </div>
                  {/* Note */}
                  <div>
                    <p className="text-sm text-muted-foreground">Note:</p>
                    <p className="font-medium max-w-sm">
                      {orderDetail.order.note}
                    </p>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date:</p>
                    <p className="font-medium">
                      {formatDate(orderDetail.order.created_at)}
                    </p>
                  </div>

                  {/* Proof Payment */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Proof Payment:
                    </p>
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={handleQrisPreviewClick}
                      disabled={!proofPaymentPreview}
                      className={`px-6 py-2 rounded-lg border transition-colors font-medium text-sm border-border bg-muted text-muted-foreground ${
                        proofPaymentPreview
                          ? " cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                    >
                      Proof Payment Preview
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Status:</p>
                    {orderDetail.order.status_shipping === "cancelPending" ||
                    orderDetail.order.status_shipping === "cancelled" ||
                    orderDetail.order.status_shipping === "awaitingPayment" ? (
                      <div className="flex items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                            statusConfig[orderDetail.order.status_shipping]
                              .color
                          }`}
                        >
                          <span>
                            {
                              statusConfig[orderDetail.order.status_shipping]
                                .label
                            }
                          </span>
                        </span>
                        {((orderDetail.order.status_shipping ===
                          "cancelPending" &&
                          orderDetail.order.cancel_by === "buyer") ||
                          orderDetail.order.status_shipping ===
                            "awaitingPayment") && (
                          <div className="flex items-center gap-1 ml-2">
                            {/* Tombol Setuju */}
                            <ConfirmDialog
                              onConfirm={() =>
                                handleApprove(
                                  orderDetail.order.order_id,
                                  orderDetail.order.status_shipping
                                )
                              }
                            >
                              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                <Check size={16} />
                              </button>
                            </ConfirmDialog>

                            {/* Tombol Tolak */}
                            <ConfirmDialog
                              onConfirm={() =>
                                handleDeny(
                                  orderDetail.order.order_id,
                                  orderDetail.order.status_shipping
                                )
                              }
                            >
                              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                <X size={16} />
                              </button>
                            </ConfirmDialog>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* Select Status */}
                        <div className="relative inline-block">
                          <select
                            value={curentStatusShipped}
                            onChange={(e) =>
                              setCurrentStatusShipped(e.target.value)
                            }
                            className={`appearance-none px-3 pr-8 py-1.5 rounded-full text-sm font-medium  bg-background text-foreground focus:outline-none transition-colors cursor-pointer ${
                              statusConfig[curentStatusShipped]?.color || ""
                            }`}
                          >
                            {Object.entries(statusConfig)
                              .filter(
                                ([key]) =>
                                  key !== "cancelPending" &&
                                  key !== "cancelled" &&
                                  key !== "awaitingPayment"
                              )
                              .map(([key, val]) => (
                                <option
                                  key={key}
                                  value={key}
                                  className="bg-popover text-popover-foreground border-0 outline-none"
                                >
                                  {val.label}
                                </option>
                              ))}
                          </select>

                          {/* Ikon panah dari Lucide */}
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>

                        {/* Tombol Save */}
                        <button
                          onClick={() =>
                            handleUpdateShippingStatus(
                              orderDetail.order.order_id,
                              curentStatusShipped
                            )
                          }
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                        >
                          <Check size={16} className="mr-1" />
                          <span className="text-sm font-medium">Save</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </main>

        {/* Checkout Summary */}
        <aside className="w-full xl:w-1/2">
          <SlideIn direction="left">
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
                      {orderDetail.order.shop_name}
                    </span>
                  </Link>
                  {/* Telephone */}
                  <div className="flex items-center gap-2 ml-1 mt-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs text-muted-foreground">
                      {orderDetail.order.shop_phone}
                    </span>
                  </div>

                  {/* Selected Items */}
                  <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
                    {orderDetail.order_items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
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
                            {item.label.replace("-", " ")} • Qty:{" "}
                            {item.quantity}
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
                      {formatPrice(orderDetail.order.total_price - 30000)}
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
                        {formatPrice(orderDetail.order.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </SlideIn>
        </aside>
        {/* Preview Overlay/Popup */}
        {showProofPaymentPreview && proofPaymentPreview && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
            <Card className="relative rounded-lg p-6 bg-popover max-w-sm max-h-[90vh] overflow-auto">
              {/* Close Button */}
              <button
                onClick={() => setShowProofPaymentPreview(false)}
                className="absolute top-5 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Proof Payment
                </h3>
                <img
                  src={proofPaymentPreview}
                  alt="QRIS Preview"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg border"
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default SaleDetail;
