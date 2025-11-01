import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import Empty from "../ui/Empty";
import CartCard from "./CartCard";
import CartDetail from "./CartDetail";
import Loading from "../ui/loading";

export default function CartList() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { cart, loading, loadCart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useProducts();

  // State untuk track items yang dipilih (array of cart IDs)
  const [selectedCartIds, setSelectedCartIds] = useState([]);

  // Redirect jika bukan buyer atau seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "buyer" && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  // Load cart when user is available
  useEffect(() => {
    if (user?.id) {
      loadCart(user.id);
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

  // Fungsi untuk handle selection
  const handleSelectCart = (cartId) => {
    const clickedItem = cart.find((item) => item.id === cartId);

    // Jika belum ada yang dipilih, pilih item ini
    if (selectedCartIds.length === 0) {
      setSelectedCartIds([cartId]);
      return;
    }

    // Cek shopId dari item yang sudah dipilih
    const firstSelectedItem = cart.find(
      (item) => item.id === selectedCartIds[0]
    );

    // Jika item sudah dipilih, unselect
    if (selectedCartIds.includes(cartId)) {
      const newSelected = selectedCartIds.filter((id) => id !== cartId);
      // Jika tidak ada yang tersisa, pilih item pertama dari cart
      setSelectedCartIds(newSelected.length > 0 ? newSelected : [cart[0].id]);
      return;
    }

    // Jika shopId berbeda, ganti semua selection dengan item yang baru diklik
    if (clickedItem.shopId !== firstSelectedItem.shopId) {
      setSelectedCartIds([cartId]);
      return;
    }

    // Jika shopId sama, tambahkan ke selection
    setSelectedCartIds([...selectedCartIds, cartId]);
  };

  // Wrapper functions dengan userId
  const handleIncreaseQuantity = async (cartItem) => {
    if (!user?.id) return;
    await increaseQuantity(user.id, cartItem);
  };

  const handleDecreaseQuantity = async (cartItem) => {
    if (!user?.id) return;
    await decreaseQuantity(user.id, cartItem);
  };

  const handleRemoveFromCart = async (cartId) => {
    if (!user?.id) return;
    await removeFromCart(user.id, cartId);
  };

  // Dapatkan data items yang terpilih untuk CartDetail
  const selectedCartItems = cart.filter((item) =>
    selectedCartIds.includes(item.id)
  );

  // Hitung total harga dari semua item yang dipilih
  const selectedItemsPrice = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <section className="px-4">
      {cart.length === 0 ? (
        <Empty>Your cart is empty</Empty>
      ) : (
        <div className="md:-mt-2">
          <h1 className="text-lg md:text-2xl font-semibold mb-2">My Cart</h1>
          <div className="flex flex-col xl:flex-row gap-6">
            <main className="w-full xl:w-1/2">
              <ul className="mt-4 space-y-4">
                {cart.map((cartItem) => (
                  <li key={cartItem.id}>
                    <CartCard
                      cartItem={cartItem}
                      isSelected={selectedCartIds.includes(cartItem.id)}
                      onSelect={handleSelectCart}
                      increaseQuantity={handleIncreaseQuantity}
                      decreaseQuantity={handleDecreaseQuantity}
                      removeFromCart={handleRemoveFromCart}
                    />
                  </li>
                ))}
              </ul>
            </main>
            <aside className="mt-4 w-full xl:w-1/2">
              <CartDetail
                selectedItems={selectedCartItems}
                selectedItemsPrice={selectedItemsPrice}
              />
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}
