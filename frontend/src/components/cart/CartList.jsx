import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import Empty from "../ui/Empty";
import CartCard from "./CartCard";
import CartDetail from "./CartDetail";

export default function CartList() {
  const { cart, totalPrice, addToCart, decreaseQuantity, removeFromCart } =
    useOutletContext();
  
  // State untuk track item yang dipilih
  const [selectedCartId, setSelectedCartId] = useState(null);

  // Set default selection ke cart pertama saat component mount atau cart berubah
  useEffect(() => {
    if (cart.length > 0) {
      setSelectedCartId(cart[0].id);
    } else {
      setSelectedCartId(null);
    }
  }, [cart]);

  // Fungsi untuk handle selection
  const handleSelectCart = (productId) => {
    if (selectedCartId === productId) {
      // Jika klik item yang sama, unselect dan kembali ke default (cart pertama)
      setSelectedCartId(cart.length > 0 ? cart[0].id : null);
    } else {
      // Pilih item baru
      setSelectedCartId(productId);
    }
  };

  // Dapatkan data item yang terpilih untuk CartDetail
  const selectedCartItem = cart.find(item => item.id === selectedCartId);
  const selectedItemPrice = selectedCartItem 
    ? selectedCartItem.price * selectedCartItem.quantity * 15000
    : 0;

  return (
    <section className="px-4">
      {cart.length === 0 ? (
        <Empty>Your cart is empty</Empty>
      ) : (
        <div className="md:-mt-2">
          <h1 className="text-xl font-semibold">My Cart</h1>
          <div className="flex flex-col xl:flex-row gap-6">
            <main className="w-full xl:w-1/2">
              <ul className="mt-4 space-y-4">
                {cart.map((product) => (
                  <li key={product.id}>
                    <CartCard
                      product={product}
                      isSelected={selectedCartId === product.id}
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
                selectedItem={selectedCartItem}
                selectedItemPrice={selectedItemPrice}
              />
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}