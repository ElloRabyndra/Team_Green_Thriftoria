import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./Schema";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "../ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import EyeButton from "../ui/eyeButton";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, isEmailRegistered } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);

    try {
      // Cek apakah email sudah terdaftar
      if (isEmailRegistered(data.email)) {
        setError("email", {
          type: "manual",
          message: "Email already exists",
        });
        setIsSubmitting(false);
        return;
      }

      // Register user baru
      const result = registerUser(data);

      if (result.success) {
        // Reset form
        reset();

        // Notif sukses
        toast.success(result.message);

        // Redirect ke halaman login
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full min-w-80 md:min-w-2xl mt-6">
      <CardHeader className={"flex items-center justify-between gap-2"}>
        <CardTitle>Register your account</CardTitle>
        <CardAction></CardAction>
      </CardHeader>
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
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Insert Name..."
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
                placeholder="Insert phone Number..."
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
                placeholder="Insert Address..."
                autoComplete="off"
                disabled={isSubmitting}
              />
              {errors.address && (
                <ErrorMessage ErrorMessage={errors.address.message} />
              )}
            </div>
            <div className="space-y-6 lg:flex lg:gap-4 lg:space-y-0">
              <div className="grid gap-2 w-full">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={`${showPassword ? "text" : "password"}`}
                    placeholder="Insert Password..."
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  <EyeButton
                    isSubmitting={isSubmitting}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </div>
                {errors.password && (
                  <ErrorMessage ErrorMessage={errors.password.message} />
                )}
              </div>
              {/* Password Confirmation */}
              <div className="grid gap-2 w-full">
                <div className="flex items-center">
                  <Label htmlFor="passwordConfirmation">
                    Password Confirmation
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    {...register("passwordConfirmation")}
                    id="passwordConfirmation"
                    type={`${showPasswordConfirm ? "text" : "password"}`}
                    placeholder="Insert Password Confirmation..."
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  <EyeButton
                    isSubmitting={isSubmitting}
                    showPassword={showPasswordConfirm}
                    setShowPassword={setShowPasswordConfirm}
                  />
                </div>
                {errors.passwordConfirmation && (
                  <ErrorMessage
                    ErrorMessage={errors.passwordConfirmation.message}
                  />
                )}
              </div>
            </div>
            {/* Password */}
            {/* Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <CardDescription>
          Already have an account?{" "}
          <Link to="/login" className="font-medium underline">
            Login
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
