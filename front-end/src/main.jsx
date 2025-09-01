import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./hooks/useAuth";
import AuthRedirect from "./components/auth/AuthRedirect";
import ToastWrapper from "./components/auth/ToastWrapper";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ThemeProvider from "./context/ThemeContext.jsx";
import App from "./pages/App";
import "./style/Style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastWrapper />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
