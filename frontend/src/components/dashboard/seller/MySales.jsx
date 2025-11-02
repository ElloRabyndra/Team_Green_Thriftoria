import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SaleCard from "./SaleCard";
import { useSales } from "@/hooks/useSales";
import Loading from "@/components/ui/loading";
import { SlideIn } from "@/components/animations/SlideIn";

const MySales = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { sales, loading, fetchSales } = useSales();

  // Panggil fetchOrders setelah user terautentikasi
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "seller") {
        navigate(-1);
        return;
      }
      fetchSales(user.Shop?.id || user.id); // nanti ganti ke user.Shop.id
    }
  }, [isLoading, user, navigate]);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <section className="p-4 py-0">
      <div className="mb-6">
        <h1 className="text-lg md:text-2xl font-semibold mb-2">My Sales</h1>
      </div>

      {sales.length === 0 ? (
        <Empty>No sales found</Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {sales.map((sale) => (
            <SlideIn key={sale.id} direction="down">
              <SaleCard sale={sale} />
            </SlideIn>
          ))}
        </div>
      )}
    </section>
  );
};

export default MySales;
