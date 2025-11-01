import { useRef, useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "./Schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, X, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import ErrorMessage from "../ErrorMessage";
import CheckoutDetail from "./CheckoutDetail";
import { Textarea } from "../ui/textarea";
import { toast } from "react-toastify";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state;
  const { removeFromCart } = useProducts();
  const [qrisPreview, setQrisPreview] = useState(
    "https://img.freepik.com/free-vector/scan-me-qr-code_78370-2915.jpg?semt=ais_hybrid&w=740&q=80"
  );
  const [showQrisPreview, setShowQrisPreview] = useState(false);
  const [proofPaymentFile, setProofPaymentFile] = useState(null);
  const [proofPaymentPreview, setProofPaymentPreview] = useState(null);
  const [showProofPaymentPreview, setShowProofPaymentPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { makeOrder } = useOrders();

  // Redirect jika tidak ada data
  useEffect(() => {
    if (
      !checkoutData ||
      !checkoutData.selectedItems ||
      checkoutData.selectedItems.length === 0
    ) {
      navigate("/cart");
    }
  }, [checkoutData, navigate]);

  if (!checkoutData) {
    return null;
  }

  const {
    userId,
    shopId,
    selectedItems,
    subtotal,
    deliveryFee,
    total,
    shopName,
  } = checkoutData;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("proofPayment", {
          type: "manual",
          message: "Please select a valid image file (JPEG, PNG)",
        });
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("proofPayment", {
          type: "manual",
          message: "File size must be less than 5MB",
        });
        return;
      }

      setProofPaymentFile(file);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue("proofPayment", dataTransfer.files, {
        shouldValidate: true,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofPaymentPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofPaymentPreviewClick = () => {
    setShowProofPaymentPreview(true);
  };
  const handleQrisPreviewClick = () => {
    if (qrisPreview) {
      setShowQrisPreview(true);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: userId,
        shopId: shopId,
        recipient: data.recipient,
        telephone: data.telephone,
        address: data.address,
        note: data.note,
        totalPrice: total,
        proofPayment: proofPaymentFile,
        orderItems: selectedItems.map((item) => ({
          id: item.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await makeOrder(orderData);

      if (result.success) {
        // Hapus items dari cart
        for (const item of selectedItems) {
          await removeFromCart(userId, item.id);
        }
        toast.success("Created Order successfully!");
        navigate("/dashboard/orders");
      } else {
        toast.error(result.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred while creating order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4 md:ml-4">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col xl:flex-row gap-6"
      >
        <main className="w-full xl:w-1/2">
          <Card className="w-full min-w-80 md:min-w-lg">
            <CardHeader className="flex items-center justify-between gap-2">
              <CardTitle>Checkout Form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Recipient */}
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    {...register("recipient")}
                    id="recipient"
                    type="text"
                    placeholder="Insert Recipient..."
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {errors.recipient && (
                    <ErrorMessage ErrorMessage={errors.recipient.message} />
                  )}
                </div>
                <div className="space-y-6 lg:flex lg:gap-4 lg:space-y-0">
                  {/* Telephone */}
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="telephone">Telephone</Label>
                    <Input
                      {...register("telephone")}
                      id="telephone"
                      type="text"
                      placeholder="Insert Telephone..."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {errors.telephone && (
                      <ErrorMessage ErrorMessage={errors.telephone.message} />
                    )}
                  </div>
                  {/* Address */}
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      {...register("address")}
                      id="address"
                      type="text"
                      placeholder="Insert Address..."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {errors.address && (
                      <ErrorMessage ErrorMessage={errors.address.message} />
                    )}
                  </div>
                </div>
                {/* Note */}
                <div className="grid gap-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    {...register("note")}
                    id="note"
                    placeholder="Insert Note..."
                    autoComplete="off"
                    disabled={isSubmitting}
                    className="resize-none"
                  />
                </div>
                {/* Payment Option */}
                <div className="grid gap-2">
                  <Label>Payment Option</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        {...register("payment_option")}
                        id="payment_option"
                        type="text"
                        value="BCA: 123456789 - Seller"
                        autoComplete="off"
                        disabled
                      />
                    </div>
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={handleQrisPreviewClick}
                      disabled={!qrisPreview}
                      className={`px-6 py-2 rounded-lg border transition-colors font-medium text-sm border-border bg-muted text-muted-foreground ${
                        qrisPreview ? " cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      Qris
                    </button>
                    {/* Preview Overlay/Popup */}
                    {showQrisPreview && qrisPreview && (
                      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <Card className="relative rounded-lg p-4 bg-popover max-w-2xl max-h-[90vh] overflow-auto">
                          {/* Close Button */}
                          <button
                            onClick={() => setShowQrisPreview(false)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          {/* Image */}
                          <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                              QRIS Payment Picture Preview
                            </h3>
                            <img
                              src={qrisPreview}
                              alt="QRIS Preview"
                              className="max-w-full max-h-[70vh] object-contain rounded-lg border"
                            />
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
                {/* Proof of Payment */}
                <div className="space-y-4">
                  {/* Input Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Proof Payment Picture
                    </label>
                    <div className="flex gap-2 mt-2">
                      {/* Input Proof Payment Button */}
                      <div className="flex-1">
                        <input
                          {...register("proofPayment")}
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="proofPayment"
                        />
                        <label
                          htmlFor="proofPayment"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-card text-card-foreground"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {proofPaymentFile
                              ? proofPaymentFile.name
                              : "Input Proof"}
                          </span>
                        </label>
                      </div>

                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={handleProofPaymentPreviewClick}
                        disabled={!proofPaymentPreview}
                        className={`px-6 py-2 rounded-lg border transition-colors font-medium text-sm ${
                          proofPaymentPreview
                            ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                            : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                    {errors.proofPayment && (
                      <ErrorMessage
                        ErrorMessage={errors.proofPayment.message}
                      />
                    )}
                  </div>

                  {/* Preview Overlay/Popup */}
                  {showProofPaymentPreview && qrisPreview && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                      <Card className="relative rounded-lg p-4 bg-popover max-w-2xl max-h-[90vh] overflow-auto">
                        {/* Close Button */}
                        <button
                          onClick={() => setShowProofPaymentPreview(false)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {/* Image */}
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                            Proof Payment Picture Preview
                          </h3>
                          <img
                            src={proofPaymentPreview}
                            alt="Proof Payment Preview"
                            className="max-w-full max-h-[70vh] object-contain rounded-lg border"
                          />
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <aside className="w-full xl:w-1/2">
          <CheckoutDetail
            selectedItems={selectedItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            shopName={shopName}
          />
        </aside>
      </form>
    </section>
  );
}
