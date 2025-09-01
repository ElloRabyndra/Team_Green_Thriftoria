import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "./Schema";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "./ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import EyeButton from "../ui/eyeButton";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
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

  // Set default value email dari user yang sedang login
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    try {
      // Lakukan update profile
      const result = updateProfile(data);

      if (result.success) {
        // Reset form
        reset();
        
        // Set email kembali setelah reset
        setValue("email", data.email);
        
        // Notif sukses
        toast.success(result.message);
        

      } else {
        // Set error berdasarkan kondisi
        if (result.message === "Incorrect old password!") {
          setError("old_password", {
            type: "manual",
            message: "Incorrect old password"
          });
        } else if (result.message === "Email already in use!") {
          setError("email", {
            type: "manual",
            message: "Email already in use"
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

  return (
    <section className="space-y-6">
      {/* My Profile */}
      <h1 className="text-lg font-semibold">My Profile</h1>
      <Card className={"w-full -mt-4 min-w-80 md:min-w-md px-4 flex-row items-center gap-0"}>
        <Avatar className="w-14 h-14">
          <AvatarImage src="https://i.pinimg.com/1200x/77/00/70/7700709ac1285b907c498a70fbccea5e.jpg"></AvatarImage>
        </Avatar>
        <CardContent className="px-4">
          <h1 className="text-md font-semibold">{user?.email?.split("@")[0]?.replace(/^\w/, c => c.toUpperCase())}</h1>
          <p className="text-sm font-medium text-gray-500">{user?.email}</p>
        </CardContent>
      </Card>
      
      {/* Edit Profile */}
      <Card className="w-full min-w-80 md:min-w-md">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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
              
              <div className="grid gap-2">
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
              
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="new_password_confirm">New Password Confirm</Label>
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
                  <ErrorMessage ErrorMessage={errors.new_password_confirm.message} />
                )}
              </div>
              
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