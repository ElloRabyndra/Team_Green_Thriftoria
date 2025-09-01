import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./Schema";
import { Link, useNavigate, useLocation } from "react-router";
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
import ErrorMessage from "./ErrorMessage";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import EyeButton from "../ui/eyeButton";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isEmailRegistered, validatePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  //jika user diarahkan dari ProtectedRoute
  const from = location.state?.from?.pathname || "/";
  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    try {
      //Lakukan login
      const result = login(data);

      if (result.success) {
        // Reset form
        reset();
        
        // Notif sukses
        toast.success(result.message);

        // Redirect ke halaman yang dituju sebelumnya atau ke home
        navigate(from, { replace: true });
      } else {
        // Set error berdasarkan kondisi
        if (!isEmailRegistered(data.email)) {
          setError("email", {
            type: "manual",
            message: "Email not registered"
          });
        } else if (!validatePassword(data.email, data.password)) {
          setError("password", {
            type: "manual",
            message: "Incorrect password"
          });
        } else {
          console.error("Login error:", result.message);
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full min-w-80 md:min-w-md">
      <CardHeader className={"flex items-center justify-between gap-2"}>
        <CardTitle>Login to your account</CardTitle>
        <CardAction>
          <Button variant="link">
            <Link to="/register">Register</Link>
          </Button>
        </CardAction>
      </CardHeader>
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
              {errors.email && <ErrorMessage ErrorMessage={errors.email.message} />}
            </div>
            <div className="grid gap-2">
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
              {errors.password && <ErrorMessage ErrorMessage={errors.password.message} />}
            </div>
            <Button 
              type="submit" 
              className="w-full cursor-pointer" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}