import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import App from "@/pages/App";
import "@/style/Style.css";

const Routing = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <section className={`${theme} font-[Poppins] min-h-screen`}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </section>
  );
};

export default Routing;
