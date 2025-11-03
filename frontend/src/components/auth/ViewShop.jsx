import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Store } from "lucide-react";
import Empty from "@/components/ui/Empty";
import ProductCard from "../product/ProductCard";
import Loading from "../ui/loading";
import { useShop } from "@/hooks/useShop";
import { useProducts } from "@/hooks/useProducts";
import { SlideIn } from "../animations/SlideIn";
import { Slide } from "react-toastify";

const ViewShop = () => {
  const { shopId } = useParams();
  const { shop, loading, fetchDetailShop } = useShop(shopId);
  const {
    products,
    loading: productLoading,
    addToCart,
    removeProduct,
  } = useProducts();
  const [shopProducts, setShopProducts] = useState([]);

  // Fetch Detail Shop
  useEffect(() => {
    fetchDetailShop(Number(shopId));
  }, [shopId]);

  // Filter produk penjual
  useEffect(() => {
    if (products.length === 0) return;
    setShopProducts(products.filter((p) => p.shop_id === Number(shopId)));
  }, [products]);

  // Loading state
  if (loading || productLoading) return <Loading />;

  if (!shop) return <Empty>Shop not found</Empty>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header toko */}
      <SlideIn direction="up">
        <Card className="mb-6 border border-border/40 shadow-md hover:shadow-lg transition-all p-0">
          <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
            <div>
              <h1 className="text-sm md:text-lg font-semibold text-foreground flex items-center gap-2">
                <Store className="w-6 h-6 text-primary" />
                {shop.shop_name}
              </h1>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{shop.shop_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{shop.shop_telephone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideIn>
      <SlideIn direction="up">
        <section className="p-4 py-0 ">
          <div className="mb-6">
            <h1 className="text-lg md:text-2xl font-semibold mb-2">
              Product List
            </h1>
          </div>
          {/* Menampilkan produk penjual */}
          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {shopProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  removeProduct={removeProduct}
                />
              ))}
            </div>
          ) : (
            <Empty>Product not found</Empty>
          )}
        </section>
      </SlideIn>
    </div>
  );
};

export default ViewShop;
