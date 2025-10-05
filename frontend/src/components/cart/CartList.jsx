import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Empty from "../ui/Empty";
import CartCard from "./CartCard";
import CartDetail from "./CartDetail";

export default function CartList() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQuantity, removeFromCart } =
    useOutletContext();

  // State untuk track items yang dipilih (array of IDs)
  const [selectedCartIds, setSelectedCartIds] = useState([]);

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) logout();
  }, [isLoading, user]);

  // Redirect jika bukan buyer atau seller
  useEffect(() => {
    if (!isLoading && user && user.role !== "buyer" && user.role !== "seller") {
      navigate(-1);
    }
  }, [isLoading, user, navigate]);

  // Set default selection ke cart pertama saat component mount atau cart berubah
  useEffect(() => {
    if (cart.length > 0) {
      setSelectedCartIds([cart[0].id]);
    } else {
      setSelectedCartIds([]);
    }
  }, [cart]);

  // Fungsi untuk handle selection
  const handleSelectCart = (productId) => {
    const clickedProduct = cart.find((item) => item.id === productId);
    
    // Jika belum ada yang dipilih, pilih item ini
    if (selectedCartIds.length === 0) {
      setSelectedCartIds([productId]);
      return;
    }

    // Cek shopName dari item yang sudah dipilih
    const firstSelectedProduct = cart.find(
      (item) => item.id === selectedCartIds[0]
    );

    // Jika item sudah dipilih, unselect
    if (selectedCartIds.includes(productId)) {
      const newSelected = selectedCartIds.filter((id) => id !== productId);
      // Jika tidak ada yang tersisa, pilih item pertama dari cart
      setSelectedCartIds(newSelected.length > 0 ? newSelected : [cart[0].id]);
      return;
    }

    // Jika shopName berbeda, ganti semua selection dengan item yang baru diklik
    if (clickedProduct.shopName !== firstSelectedProduct.shopName) {
      setSelectedCartIds([productId]);
      return;
    }

    // Jika shopName sama, tambahkan ke selection
    setSelectedCartIds([...selectedCartIds, productId]);
  };

  // Dapatkan data items yang terpilih untuk CartDetail
  const selectedCartItems = cart.filter((item) =>
    selectedCartIds.includes(item.id)
  );
  
  // Hitung total harga dari semua item yang dipilih
  const selectedItemsPrice = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity * 15000,
    0
  );

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
                {cart.map((product) => (
                  <li key={product.id}>
                    <CartCard
                      product={product}
                      isSelected={selectedCartIds.includes(product.id)}
                      onSelect={handleSelectCart}
                      addToCart={addToCart}
                      decreaseQuantity={decreaseQuantity}
                      removeFromCart={removeFromCart}
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