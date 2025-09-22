import { useEffect } from "react";
import { useOutletContext } from "react-router";
import ProductCard from "./ProductCard";
import RenderProduct from "./RenderProduct";
import Empty from "../ui/Empty";
import { useAuth } from "@/hooks/useAuth";

export default function ProductList() {
  const { user, isLoading, logout } = useAuth();

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  const { products, loading, addToCart } = useOutletContext();
  if (loading) {
    return <RenderProduct />;
  }

  return (
    <>
      {products.length === 0 && <Empty>No products found</Empty>}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            userRole={user.userRole} // Sementara
          />
        ))}
      </div>
    </>
  );
}
