import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import AuthRedirect from "@/components/auth/AuthRedirect";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import MainPage from "@/pages/MainPage";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
import Profile from "@/components/auth/Profile";
import ProductList from "@/components/product/ProductList";
import ProductDetail from "@/components/product/ProductDetail";
import CartList from "@/components/cart/CartList";
import App from "@/pages/App";
import "@/style/Style.css";
import EditProduct from "@/components/product/EditProduct";
import Dashboard from "@/components/dashboard/Dashboard";
import RegisterShop from "@/components/dashboard/buyer/RegisterShop";

const Routing = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <section
      className={`${theme} bg-background text-foreground font-[Poppins] min-h-screen`}
    >
      <Routes>
        {/* <Route path="/" element={<App />} /> */}
        <Route element={<AuthPage />}>
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
        </Route>
        <Route path="/" element={<MainPage />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="register-shop"
              element={
                <ProtectedRoute>
                  <RegisterShop />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            index
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartList />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </section>
  );
};

export default Routing;
