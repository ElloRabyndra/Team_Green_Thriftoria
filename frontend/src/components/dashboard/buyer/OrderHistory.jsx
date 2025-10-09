import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Empty from "@/components/ui/Empty";
import OrderCard from "./OrderCard";
import { useAuth } from "@/hooks/useAuth";
import { sampleOrders } from "@/database/dummy";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk fetch order history (sementara dummy)
  const fetchOrderHistory = async () => {
    try {
      // TODO: nanti ganti bagian ini dengan fetch API getHistoryOrder
      // contoh nanti:
      // const response = await fetch("/api/orders/history");
      // const data = await response.json();
      // setOrders(data);

      // Sekarang masih pakai dummy
      const fetchedOrders = sampleOrders.filter(
        (order) =>
          order.statusShipping === "delivered" ||
          order.statusShipping === "cancelled"
      );

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to load order history:", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "buyer" && user.role !== "seller") {
        navigate(-1);
        return;
      }
      fetchOrderHistory();
    }
  }, [isLoading, user, navigate]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <section className="p-4 py-0">
      <div className="mb-6">
        <h1 className="text-lg md:text-2xl font-semibold mb-2">
          My Order History
        </h1>
      </div>

      {orders.length === 0 ? (
        <Empty>No orders found</Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
};

export default OrderHistory;
