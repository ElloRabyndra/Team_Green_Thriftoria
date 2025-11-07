import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "./Schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "../ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import EyeButton from "../ui/eyeButton";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Camera, Upload } from "lucide-react";
import { SlideIn } from "../animations/SlideIn";

export default function Profile() {
  const { user, updateProfile, isLoading, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const profilePictureValue = watch("profile_picture");
  // Watch email dan username untuk preview real-time
  const emailValue = watch("email");
  const usernameValue = watch("username");

  useEffect(() => {
    if (user && !isLoading) {
      reset({
        email: user.email || "",
        username: user.username || "",
        telephone: user.telephone || "",
        address: user.address || "",
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });
    }
  }, [user, isLoading, reset]);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("profile_picture", {
          type: "manual",
          message: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("profile_picture", {
          type: "manual",
          message: "File size must be less than 5MB",
        });
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Set form value
      setValue("profile_picture", file);
    }
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Get current profile image source
  const getProfileImageSrc = () => {
    if (previewImage) return previewImage;
    if (user?.profile_picture !== "https://i.pravatar.cc/150")
      return user.profile_picture;
    return "https://i.pinimg.com/1200x/77/00/70/7700709ac1285b907c498a70fbccea5e.jpg";
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { new_password_confirm, ...dataToSend } = data;

    try {
      const result = await updateProfile(dataToSend);

      if (result.success) {
        reset({
          email: data.email,
          username: data.username,
          telephone: data.telephone,
          address: data.address,
          old_password: "",
          new_password: "",
          new_password_confirm: "",
        });

        setPreviewImage(null);
        toast.success(result.message);
      } else {
        if (result.message.includes("Incorrect old password")) {
          setError("old_password", {
            type: "manual",
            message: "Incorrect old password",
          });
        } else if (result.message.includes("Email already in use")) {
          setError("email", {
            type: "manual",
            message: "Email already in use",
          });
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Loading state
  if (isLoading || !user) {
    return (
      <section className="space-y-6 md:ml-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div>Loading profile...</div>
        </div>
      </section>
    );
  }
  return (
    <section className="space-y-4 md:ml-4">
      {/* My Profile */}
      <h1 className="text-lg md:text-2xl font-semibold">My Profile</h1>

      {/* Edit Profile */}
      <SlideIn direction="left">
        <Card className="w-full min-w-80 md:min-w-md">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <Avatar
                        className="w-18 h-18 border-4 border-primary/20 cursor-pointer transition-all duration-300 group-hover:border-primary/40"
                        onClick={handleAvatarClick}
                      >
                        <AvatarImage
                          src={getProfileImageSrc()}
                          alt="Profile Picture"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </Avatar>

                      {/* Camera overlay */}
                      <div
                        className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      {...register("profile_picture")}
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">
                      {usernameValue || user.username}
                    </p>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {emailValue || user.email}
                    </p>
                    {/* Error Message for Profile Picture */}
                    {errors.profile_picture && (
                      <ErrorMessage
                        ErrorMessage={errors.profile_picture.message}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-6 lg:flex lg:gap-4 lg:space-y-0">
                  {/* Email */}
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="Insert Email..."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <ErrorMessage ErrorMessage={errors.email.message} />
                    )}
                  </div>
                  {/* Username */}
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      {...register("username")}
                      id="username"
                      type="text"
                      placeholder="Insert Username..."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {errors.username && (
                      <ErrorMessage ErrorMessage={errors.username.message} />
                    )}
                  </div>
                </div>

                <div className="space-y-6 lg:flex lg:gap-4 lg:space-y-0">
                  {/* Telephone */}
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="telephone">Phone Number</Label>
                    <Input
                      {...register("telephone")}
                      id="telephone"
                      type="text"
                      placeholder="Insert phone Number..."
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

                {/* Old Password */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="old_password">Old Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      {...register("old_password")}
                      id="old_password"
                      type={`${showOldPassword ? "text" : "password"}`}
                      placeholder="Insert Old Password..."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    <EyeButton
                      isSubmitting={isSubmitting}
                      showPassword={showOldPassword}
                      setShowPassword={setShowOldPassword}
                    />
                  </div>
                  {errors.old_password && (
                    <ErrorMessage ErrorMessage={errors.old_password.message} />
                  )}
                </div>

                <div className="space-y-6 lg:flex lg:gap-4 lg:space-y-0">
                  {/* New Password */}
                  <div className="grid gap-2 w-full">
                    <div className="flex items-center">
                      <Label htmlFor="new_password">New Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        {...register("new_password")}
                        id="new_password"
                        type={`${showNewPassword ? "text" : "password"}`}
                        placeholder="Insert New Password..."
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                      <EyeButton
                        isSubmitting={isSubmitting}
                        showPassword={showNewPassword}
                        setShowPassword={setShowNewPassword}
                      />
                    </div>
                    {errors.new_password && (
                      <ErrorMessage
                        ErrorMessage={errors.new_password.message}
                      />
                    )}
                  </div>
                  {/* New Password Confirm */}
                  <div className="grid gap-2 w-full">
                    <div className="flex items-center">
                      <Label htmlFor="new_password_confirm">
                        New Password Confirm
                      </Label>
                    </div>
                    <div className="relative">
                      <Input
                        {...register("new_password_confirm")}
                        id="new_password_confirm"
                        type={`${showNewPasswordConfirm ? "text" : "password"}`}
                        placeholder="Insert New Password Confirm..."
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                      <EyeButton
                        isSubmitting={isSubmitting}
                        showPassword={showNewPasswordConfirm}
                        setShowPassword={setShowNewPasswordConfirm}
                      />
                    </div>
                    {errors.new_password_confirm && (
                      <ErrorMessage
                        ErrorMessage={errors.new_password_confirm.message}
                      />
                    )}
                  </div>
                </div>

                {/* Button */}
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SlideIn>
    </section>
  );
}
