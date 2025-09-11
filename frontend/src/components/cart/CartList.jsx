import { useOutletContext } from "react-router";
import Empty from "../ui/Empty";
import CartCard from "./CartCard";
import CartDetail from "./CartDetail";

export default function CartList() {
  const { cart, totalPrice, addToCart, decreaseQuantity, removeFromCart } =
    useOutletContext();

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
                      addToCart={addToCart}
                      decreaseQuantity={decreaseQuantity}
                      removeFromCart={removeFromCart}
                    />
                  </li>
                ))}
              </ul>
            </main>
            <aside className="mt-4 w-full xl:w-1/2">
              <CartDetail totalPrice={totalPrice} />
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}
