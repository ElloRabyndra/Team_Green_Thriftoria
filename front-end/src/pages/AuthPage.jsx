import ToggleButton from "@/components/theme/ToggleButton";
import { Outlet } from "react-router";

export default function AuthPage() {
  return (
    <section className={`flex flex-col items-center justify-center min-h-screen`}>
      <div className="absolute top-5 right-6"><ToggleButton/></div>
      <div className="p-8 space-y-3 min-w-sm">
        <Outlet />
      </div>
    </section>
  );
}