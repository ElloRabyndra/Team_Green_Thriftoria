import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import Empty from "../ui/Empty";
import CartCard from "./CartCard";
import CartDetail from "./CartDetail";
import Loading from "../ui/loading";
import { SlideIn } from "../animations/SlideIn";

export default function CartList() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    cart,
    loading,
    cartLoading,
    loadCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useProducts();

  // State untuk track items yang dipilih (array of cart IDs)
  const [selectedCartIds, setSelectedCartIds] = useState([]);

  // Gabungkan semua CartItem dari semua toko menjadi satu array datar
  const flatCartItems = cart.flatMap((shopCart) =>
    shopCart.cart_items.map((item) => ({
      ...item,
      shop_id: shopCart.shop_id,
      shop_name: shopCart.shop_name,
    }))
  );

  // Redirect jika bukan buyer atau seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "buyer" && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  // Load cart ketika user terautentikasi
  useEffect(() => {
    if (user?.id) {
      loadCart();
    }
  }, [user?.id]);

  // Set default selection ke cart pertama saat component mount atau cart berubah
  useEffect(() => {
    if (cart.length > 0) {
      setSelectedCartIds([cart[0].id]);
    } else {
      setSelectedCartIds([]);
    }
  }, [cart.length]);

  // Set default selection ke item pertama saat component mount atau flatCartItems berubah
  useEffect(() => {
    if (flatCartItems.length > 0) {
      if (
        selectedCartIds.length === 0 ||
        !flatCartItems.some((item) => selectedCartIds.includes(item.id))
      ) {
        setSelectedCartIds([flatCartItems[0].id]);
      }
    } else {
      setSelectedCartIds([]);
    }
  }, [flatCartItems.length]);

  // Fungsi untuk handle selection
  const handleSelectCart = (cartId) => {
    const clickedItem = flatCartItems.find((item) => item.id === cartId);

    if (!clickedItem) return;

    const firstSelectedItem = flatCartItems.find(
      (item) => item.id === selectedCartIds[0]
    );

    if (selectedCartIds.includes(cartId)) {
      const newSelected = selectedCartIds.filter((id) => id !== cartId);
      setSelectedCartIds(newSelected);
      return;
    }

    if (
      firstSelectedItem &&
      clickedItem.shop_id !== firstSelectedItem.shop_id
    ) {
      setSelectedCartIds([cartId]);
      return;
    }

    setSelectedCartIds([...selectedCartIds, cartId]);
  };

  // Wrapper functions (tanpa user_id)
  const handleIncreaseQuantity = async (cartItem) => {
    await increaseQuantity(cartItem);
  };

  const handleDecreaseQuantity = async (cartItem) => {
    await decreaseQuantity(cartItem);
  };

  const handleRemoveFromCart = async (cartId) => {
    await removeFromCart(cartId);
  };

  const selectedCartItems = flatCartItems.filter((item) =>
    selectedCartIds.includes(item.id)
  );

  const selectedItemsPrice = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading || isLoading || (!cart && cartLoading)) {
    return <Loading />;
  }

  return (
    <section className="px-4">
      {(flatCartItems.length === 0 && !cartLoading) ? (
        <Empty>Your cart is empty</Empty>
      ) : (
        <div className="md:-mt-2">
          <h1 className="text-lg md:text-2xl font-semibold mb-2">My Cart</h1>
          <div className="flex flex-col xl:flex-row gap-6">
            <main className="w-full xl:w-1/2">
              <ul className="mt-4 space-y-4">
                {flatCartItems.map((cartItem, index) => (
                  <SlideIn
                    key={cartItem.id}
                    direction="up"
                    delay={index * 0.05}
                  >
                    <li>
                      <CartCard
                        cartItem={cartItem}
                        cartLoading={cartLoading}
                        isSelected={selectedCartIds.includes(cartItem.id)}
                        onSelect={handleSelectCart}
                        increaseQuantity={handleIncreaseQuantity}
                        decreaseQuantity={handleDecreaseQuantity}
                        removeFromCart={handleRemoveFromCart}
                      />
                    </li>
                  </SlideIn>
                ))}
              </ul>
            </main>
            <aside className="mt-4 w-full xl:w-1/2">
              <SlideIn direction="left">
                <CartDetail
                  selectedItems={selectedCartItems}
                  selectedItemsPrice={selectedItemsPrice}
                  cartLoading={cartLoading}
                />
              </SlideIn>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}
