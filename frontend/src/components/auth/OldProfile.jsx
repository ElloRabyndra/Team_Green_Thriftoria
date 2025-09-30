import { useState, useEffect } from "react";
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

export default function Profile() {
  const { user, updateProfile, isLoading, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Set default value 
  useEffect(() => {
    if (user) {
      if (user.email) setValue("email", user.email);
      if(user.username) setValue("username", user.username);
      if (user.telephone) setValue("telephone", user.telephone);
      if (user.address) setValue("address", user.address);
    }
  }, [user, setValue]);

  const onSubmit = (data) => {
    setIsSubmitting(true);

    try {
      // Lakukan update profile
      const result = updateProfile(data);

      if (result.success) {
        // Reset form
        reset({
          email: data.email,
          username: data.username,
          telephone: data.telephone,
          address: data.address,
          old_password: "",
          new_password: "",
          new_password_confirm: "",
        });

        // Notif sukses
        toast.success(result.message);
      } else {
        // Set error berdasarkan kondisi
        if (result.message === "Incorrect old password!") {
          setError("old_password", {
            type: "manual",
            message: "Incorrect old password",
          });
        } else if (result.message === "Email already in use!") {
          setError("email", {
            type: "manual",
            message: "Email already in use",
          });
        } else {
          console.error("Profile update error:", result.message);
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

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-6 md:ml-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div>Loading profile...</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-4 md:ml-4">
      {/* My Profile */}
      <h1 className="text-lg md:text-2xl font-semibold">My Profile</h1>

      {/* Edit Profile */}
      <Card className="w-full min-w-80 md:min-w-md">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
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
              <div className="grid gap-2">
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
                    <ErrorMessage ErrorMessage={errors.new_password.message} />
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
    </section>
  );
}
