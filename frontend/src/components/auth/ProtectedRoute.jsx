import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Tampilkan loading saat cek authentication
  if (isLoading) {
    return null;
  }

  // Redirect ke halaman login dengan menyimpan lokasi sebelumnya
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika sudah login, tampilkan children
  return children;
}
