import { useNavigate } from "react-router";
import Empty from "@/components/ui/Empty";
import OrderCard from "./OrderCard";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import Loading from "@/components/ui/loading";
import { SlideIn } from "@/components/animations/SlideIn";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Ambil fungsi & state dari useOrders untuk history
  const { orderHistory, loading, fetchOrderHistory } = useOrders();

  // Panggil fetchOrderHistory setelah user terautentikasi
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "buyer" && user.role !== "seller") {
        navigate(-1);
        return;
      }
      fetchOrderHistory(user.id); // ambil order history milik user
    }
  }, [isLoading, user, navigate]);

  // Loading state
  if (loading) {
    return <Loading />;
  }

  console.log(orderHistory);

  return (
    <section className="p-4 py-0">
      <div className="mb-6">
        <h1 className="text-lg md:text-2xl font-semibold mb-2">
          My Order History
        </h1>
      </div>

      {orderHistory.length === 0 ? (
        <Empty>No order history found</Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {orderHistory.map((order) => (
            <SlideIn key={order.order_id} direction="down">
              <OrderCard order={order} />
            </SlideIn>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrderHistory;
