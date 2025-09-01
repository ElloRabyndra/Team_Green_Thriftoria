import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Routing from "./routing/Routing";
import { AuthProvider } from "./hooks/useAuth";
import AuthRedirect from "./components/auth/AuthRedirect";
import ToastWrapper from "./components/auth/ToastWrapper";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ThemeProvider from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routing />
          <ToastWrapper />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
