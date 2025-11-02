import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/Empty";
import OrderCard from "./OrderCard";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import Loading from "@/components/ui/loading";
import { SlideIn } from "@/components/animations/SlideIn";

const MyOrder = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Ambil semua fungsi & state dari useOrders
  const { orders, loading, fetchOrders } = useOrders();

  // Panggil fetchOrders setelah user terautentikasi
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "buyer" && user.role !== "seller") {
        navigate(-1);
        return;
      }
      fetchOrders(user.id); // ambil order milik user
    }
  }, [isLoading, user, navigate]);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <section className="p-4 py-0">
      <div className="mb-6">
        <h1 className="text-lg md:text-2xl font-semibold mb-2">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <Empty>No orders found</Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {orders.map((order) => (
            <SlideIn key={order.id} direction="down" >
              <OrderCard order={order} />
            </SlideIn>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrder;
