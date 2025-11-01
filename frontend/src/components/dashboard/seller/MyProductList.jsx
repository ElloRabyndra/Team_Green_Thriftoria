import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductCard from "@/components/product/ProductCard";
import RenderProduct from "@/components/product/RenderProduct";
import Empty from "@/components/ui/Empty";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

const MyProductList = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect jika bukan seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "seller") {
      navigate(-1); // kembali ke halaman sebelumnya
    }
  }, [isLoading, user]);

  const {
    products,
    loading: productLoading,
    addToCart,
    removeProduct,
  } = useProducts();
  const [myProducts, setMyProducts] = useState([]);

  // Filter produk penjual
  useEffect(() => {
    if (products.length === 0) return;
    setMyProducts(products.filter((p) => p.shop_id === (user.Shop?.id || user.id))); // nanti ganti ke user.Shop.id
  }, [products]);

  if (productLoading) {
    return <RenderProduct />;
  }

  const handleRemoveProduct = async (product_id) => {
    return await removeProduct(product_id);
  };

  return (
    <>
      {myProducts.length === 0 ? (
        <>
          <Empty>No products found</Empty>
          <aside className="fixed bottom-0 right-0 p-8 z-50">
            <button
              onClick={() => navigate("/dashboard/add-product")}
              className="cursor-pointer py-3 px-3 text-2xl bg-primary text-white rounded-full  transition"
            >
              <Plus />
            </button>
          </aside>
        </>
      ) : (
        <section className="p-4 py-0">
          <aside className="fixed bottom-0 right-0 p-8 z-50">
            <button
              onClick={() => navigate("/dashboard/add-product")}
              className="cursor-pointer py-3 px-3 text-2xl bg-primary text-white rounded-full  transition"
            >
              <Plus />
            </button>
          </aside>
          <div className="mb-6">
            <h1 className="text-lg md:text-2xl font-semibold mb-2">
              My Product
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemoveProduct={handleRemoveProduct}
                role={user.role} // Sementara
                shop_id={(user.Shop?.id || user.id)} // nanti ganti ke user.Shop.id
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default MyProductList;
