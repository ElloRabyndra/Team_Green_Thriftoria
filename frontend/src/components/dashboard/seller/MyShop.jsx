import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { editShopSchema } from "../Schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const MyShop = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrisFile, setQrisFile] = useState(null);
  const [qrisPreview, setQrisPreview] = useState(
    "https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-qr-code-vector-hidden-text-or-url-scanning-smartphone-technology-isolated-png-image_1886134.jpg"
  );
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Dummy data shop - ini nanti diganti dengan data real dari API/state
  const shopData = {
    shop_name: "Toko Serbaguna Jaya",
    shop_telephone: "08123456789",
    shop_address: "Jl. Merdeka No. 123, Jakarta Pusat",
    account_number: "1234567890",
    qris_picture:
      "https://png.pngtree.com/png-vector/20191027/ourmid/pngtree-qr-code-vector-hidden-text-or-url-scanning-smartphone-technology-isolated-png-image_1886134.jpg",
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editShopSchema),
  });

  // Watch untuk real-time preview di UI
  const shop_nameValue = watch("shop_name");
  const shop_telephoneValue = watch("shop_telephone");
  const shop_addressValue = watch("shop_address");
  const account_numberValue = watch("account_number");

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  // Set default values dari shopData
  useEffect(() => {
    if (shopData) {
      setValue("shop_name", shopData.shop_name);
      setValue("shop_telephone", shopData.shop_telephone);
      setValue("shop_address", shopData.shop_address);
      setValue("account_number", shopData.account_number);

      // Set QRIS preview dari data existing
      if (shopData.qris_picture) {
        setQrisPreview(shopData.qris_picture);
      }
    }
  }, [setValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("qris_picture", {
          type: "manual",
          message: "Please select a valid image file (JPEG, PNG)",
        });
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("qris_picture", {
          type: "manual",
          message: "File size must be less than 5MB",
        });
        return;
      }

      setQrisFile(file);

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue("qris_picture", dataTransfer.files, {
        shouldValidate: true,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrisPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewClick = () => {
    if (qrisPreview) {
      setShowPreview(true);
    }
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    console.log("Updated Shop Data:", data);

    try {
      // Simulasi update shop
      // Di sini nanti akan ada logic untuk update shop ke API

      // Reset form dengan nilai yang baru diupdate
      reset({
        shop_name: data.shop_name,
        shop_telephone: data.shop_telephone,
        shop_address: data.shop_address,
        account_number: data.account_number,
        qris_picture: undefined, // Clear file input setelah submit
      });

      // Clear file state tapi tetap tampilkan preview yang sudah diupdate
      setQrisFile(null);

      toast.success("Shop updated successfully!");
    } catch (error) {
      console.error("Shop update error:", error);
      toast.error("Shop update failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (qrisPreview && qrisPreview.startsWith("blob:")) {
        URL.revokeObjectURL(qrisPreview);
      }
    };
  }, [qrisPreview]);

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 -mt-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div>Loading shop data...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 -mt-4">
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
      <Card className="w-full min-w-80 md:min-w-md">
        <CardHeader className="flex items-center justify-between gap-2">
          <CardTitle>Edit Shop Profile</CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Shop Name */}
              <div className="grid gap-2">
                <Label htmlFor="shop_name">Shop Name</Label>
                <Input
                  {...register("shop_name")}
                  id="shop_name"
                  type="text"
                  placeholder="Insert Shop Name..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.shop_name && (
                  <ErrorMessage ErrorMessage={errors.shop_name.message} />
                )}
              </div>
              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="shop_telephone">Phone Number</Label>
                <Input
                  {...register("shop_telephone")}
                  id="shop_telephone"
                  type="text"
                  placeholder="Insert Shop Phone..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.shop_telephone && (
                  <ErrorMessage ErrorMessage={errors.shop_telephone.message} />
                )}
              </div>
              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="shop_address">Address</Label>
                <Input
                  {...register("shop_address")}
                  id="shop_address"
                  type="text"
                  placeholder="Insert Shop Address..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.shop_address && (
                  <ErrorMessage ErrorMessage={errors.shop_address.message} />
                )}
              </div>
              {/* Bank */}
              <div className="grid gap-2">
                <Label htmlFor="account_number">Bank Account</Label>
                <Input
                  {...register("account_number")}
                  id="account_number"
                  type="text"
                  placeholder="e.g. BCA: 1234567890 - Seller"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.account_number && (
                  <ErrorMessage ErrorMessage={errors.account_number.message} />
                )}
              </div>
              {/* Qris */}
              <div className="space-y-4">
                {/* Input Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    QRIS Payment Picture
                  </label>
                  <div className="flex gap-2 mt-2">
                    {/* Input QRIS Picture Button */}
                    <div className="flex-1">
                      <input
                        {...register("qris_picture")}
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="qris-input"
                      />
                      <label
                        htmlFor="qris-input"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-card text-card-foreground"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {qrisFile ? qrisFile.name : "Update QRIS"}
                        </span>
                      </label>
                    </div>

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={handlePreviewClick}
                      disabled={!qrisPreview}
                      className={`px-6 py-2 rounded-lg border transition-colors font-medium text-sm ${
                        qrisPreview
                          ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                          : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                  {errors.qris_picture && (
                    <ErrorMessage ErrorMessage={errors.qris_picture.message} />
                  )}
                </div>

                {/* Preview Overlay/Popup */}
                {showPreview && qrisPreview && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <Card className="relative rounded-lg p-4 bg-popover max-w-2xl max-h-[90vh] overflow-auto">
                      {/* Close Button */}
                      <button
                        onClick={() => setShowPreview(false)}
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

              {/* Button */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Shop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyShop;
