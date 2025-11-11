import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ProductCard from "./ProductCard";
import Empty from "../ui/Empty";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { SlideIn } from "../animations/SlideIn";
import Loading from "../ui/loading";

export default function ProductList() {
  const { category, query } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const {
    products,
    loading,
    cartLoading,
    changeCategory,
    addToCart,
    searchProducts,
  } = useProducts();
  const [ProductList, setProductList] = useState([]);

  // Cek apakah ada kategori ada di URL dan apakah ada query di URL
  useEffect(() => {
    if (location.pathname === "/products") {
      changeCategory("all");
    } else if (category) {
      const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
      changeCategory(capitalize(category));
    } else if (query) {
      searchProducts(query);
      changeCategory("");
    }
  }, [location, category, query]);

  // Filter produk yang bukan seller jual
  useEffect(() => {
    if (products.length === 0) {
      setProductList([]);
      return;
    }

    setProductList(
      products.filter((product) => product.shop_id !== user?.Shop?.id)
    );
  }, [products, user?.Shop?.id]);

  // Wrapper function untuk addToCart dengan user_id
  const handleAddToCart = async (product) => {
    return await addToCart(product.id);
  };

  if (loading) {
    return <Loading />;
  }

  if (loading && !ProductList) {
    return null;
  }
  return (
    <>
      {ProductList.length === 0 && !loading ? (
        <Empty>No products found</Empty>
      ) : (
        <div className="-mt-1 sm:px-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
          {ProductList.map((product) => (
            <SlideIn key={product.id} direction="up">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                cartLoading={cartLoading}
                role={user?.role}
                shop_id={user?.Shop?.id || user?.id} // nanti ganti ke user.Shop.id
              />
            </SlideIn>
          ))}
        </div>
      )}
    </>
  );
}
