import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { registerShopSchema } from "../Schema";
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
import ErrorMessage from "../../ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const RegisterShop = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrisFile, setQrisFile] = useState(null);
  const [qrisPreview, setQrisPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerShopSchema),
  });

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Redirect jika bukan buyer
  useEffect(() => {
    if (!isLoading && user && user.userRole !== "buyer") {
      navigate(-1); // kembali ke halaman sebelumnya
      // atau navigate("/") untuk ke homepage
    }
  }, [isLoading, user, navigate]);

  // Set default value email dari user yang sedang login
  useEffect(() => {
    if (user) {
      if (user.email) setValue("name", user.email.split("@")[0]);
      if (user.phone) setValue("phone", user.phone);
      if (user.address) setValue("address", user.address);
    }
  }, [user, setValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG)");
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setQrisFile(file);

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
  };

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
        <CardHeader className={"flex items-center justify-between gap-2"}>
          <CardTitle>Register Your Shop</CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Shop Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="Insert Shop Name..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <ErrorMessage ErrorMessage={errors.name.message} />
                )}
              </div>
              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="text"
                  placeholder="Insert Shop Phone..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <ErrorMessage ErrorMessage={errors.phone.message} />
                )}
              </div>
              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  {...register("address")}
                  id="address"
                  type="text"
                  placeholder="Insert Shop Address..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <ErrorMessage ErrorMessage={errors.address.message} />
                )}
              </div>
              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Bank Account</Label>
                <Input
                  {...register("bank_account")}
                  id="bank_account"
                  type="text"
                  placeholder="Insert Bank Account..."
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <ErrorMessage ErrorMessage={errors.bank_account.message} />
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
                          {qrisFile ? qrisFile.name : "Input QRIS"}
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
                {isSubmitting ? "Registering..." : "Register Shop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterShop;
