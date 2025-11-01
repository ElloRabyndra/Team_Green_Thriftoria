import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/Navbar";
import { Outlet } from "react-router";

export default function MainPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="min-h-screen">
      {/* Navbar */}
      <NavBar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout */}
      <div className="flex flex-row">
        {/* Sidebar */}
        <SideBar
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 py-6 px-5 lg:py-8 lg:px-24">
          <div className="relative mx-auto md:ml-56">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
}