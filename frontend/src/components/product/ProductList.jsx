import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ProductCard from "./ProductCard";
import RenderProduct from "./RenderProduct";
import Empty from "../ui/Empty";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

export default function ProductList() {
  const { category, query } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const {
    products,
    loading,
    changeCategory,
    selectedCategory,
    addToCart,
    searchProducts,
  } = useProducts();
  const [ProductList, setProductList] = useState([]);

  // Cek apakah ada kategori ada di URL dan apakah ada query di URL
  useEffect(() => {
    if (location.pathname === "/products") {
      changeCategory("all");
    } else if (category) {
      changeCategory(category);
    } else if (query) {
      searchProducts(query);
      changeCategory("");
    }
  }, [location, category, selectedCategory, query]);

  // Filter produk yang bukan seller jual
  useEffect(() => {
    if (products.length === 0) return;
    // if (user.Shop) {
    setProductList(
      products.filter((product) => product.shop_id !== user.id) // nanti ganti ke shop_id
    );
    // } else {
    //   setProductList(products);
    // }
  }, [products]);

  // Wrapper function untuk addToCart dengan user_id
  const handleAddToCart = async (product) => {
    return await addToCart(user.id, product);
  };

  if (loading) {
    return <RenderProduct />;
  }

  return (
    <>
      {ProductList.length === 0 && <Empty>No products found</Empty>}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ProductList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            role={user.role}
            shop_id={user.id} // nanti ganti ke shop_id
          />
        ))}
      </div>
    </>
  );
}
