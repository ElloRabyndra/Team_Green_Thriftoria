import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

// redirect jika sudah login
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default AuthRedirect;
