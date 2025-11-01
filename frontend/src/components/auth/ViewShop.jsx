import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Store } from "lucide-react";
import Empty from "@/components/ui/Empty";
import ProductCard from "../product/ProductCard";

const dummyShops = [
  {
    id: 1,
    user_id: 1,
    userName: "John Doe",
    shop_name: "Premium Fashion Store",
    shop_address: "Jl. Contoh, Jakarta, Indonesia",
    shop_telephone: "+62 812 3456 7890",
  },
];

const dummyProducts = [
  {
    id: 101,
    name: "Elegant Blazer",
    price: 350000,
    thumbnail: "https://picsum.photos/seed/blazer/400/400",
    shop_name: "Premium Fashion Store",
  },
  {
    id: 102,
    name: "Casual T-Shirt",
    price: 120000,
    thumbnail: "https://picsum.photos/seed/tshirt/400/400",
    shop_name: "Premium Fashion Store",
  },
  {
    id: 103,
    name: "Leather Shoes",
    price: 450000,
    thumbnail: "https://picsum.photos/seed/shoes/400/400",
    shop_name: "Premium Fashion Store",
  },
];

const ViewShop = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        // --- Ganti URL API di sini nanti ---
        const res = await fetch(`/api/shops/${shopId}`);
        if (!res.ok) throw new Error("Failed to fetch shop data");

        const data = await res.json();
        setShop(data.shop);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching shop data:", err);
        // fallback ke dummy data
        const foundShop = dummyShops.find((s) => s.id === Number(shopId));
        if (foundShop) {
          setShop(foundShop);
          setProducts(dummyProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-muted-foreground">
        Loading shop details...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Empty message="Shop not found." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header toko */}
      <Card className="mb-6 border border-border/40 shadow-md hover:shadow-lg transition-all p-0">
        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
          <div>
            <h1 className="text-sm md:text-lg font-semibold text-foreground flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" />
              {shop.shop_name}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Owner:{" "}
              <span className="font-medium text-foreground">
                {shop.userName}
              </span>
            </p>
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
      <section className="p-4 py-0 ">
        <div className="mb-6">
          <h1 className="text-lg md:text-2xl font-semibold mb-2">
            Product List
          </h1>
        </div>
      </section>
    </div>
  );
};

export default ViewShop;
