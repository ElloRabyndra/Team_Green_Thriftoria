import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/Empty";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { sampleOrders } from "@/database/dummy";

const MyOrder = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders (sementara pakai dummy)
  const fetchOrders = async () => {
    try {
      // TODO: Ganti bagian ini nanti dengan request ke endpoint getAllOrder
      // Contoh nanti:
      // const response = await fetch("/api/orders");
      // const data = await response.json();
      // setOrders(data);

      // Sekarang masih dummy:
      setOrders(sampleOrders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetchOrders setelah user terautentikasi
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "buyer" && user.role !== "seller") {
        navigate(-1);
        return;
      }
      fetchOrders();
    }
  }, [isLoading, user, navigate]);

  // Loading state
  if (loading) {
    return <div className="p-4">Loading...</div>;
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
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrder;
