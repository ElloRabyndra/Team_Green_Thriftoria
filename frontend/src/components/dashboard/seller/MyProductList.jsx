import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import ProductCard from "@/components/product/ProductCard";
import RenderProduct from "@/components/product/RenderProduct";
import Empty from "@/components/ui/Empty";
import { useAuth } from "@/hooks/useAuth";

const MyProductList = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Redirect jika bukan buyer atau seller
  useEffect(() => {
    if (!isLoading && user && (user.role !== "buyer" && user.role !== "seller")) {
      navigate(-1); // kembali ke halaman sebelumnya
      // atau navigate("/") untuk ke homepage
    }
  }, [isLoading, user]);

  const { products, loading, addToCart } = useOutletContext();
  if (loading) {
    return <RenderProduct />;
  }

  return (
    <>
      {products.length === 0 ? (
        <Empty>No products found</Empty>
      ) : (
        <section className="p-4 py-0">
          <div className="mb-6">
            <h1 className="text-lg md:text-2xl font-semibold mb-2">
              My Product
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                role={user.role} // Sementara
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default MyProductList;
