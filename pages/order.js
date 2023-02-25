// order page where you can see the summary and total of your order from the cart context
// Path: pages/order.js

import { useCart, useCartUpdate } from '../components/cartContext';
import FoodListCart from '../components/foodListCart';
import { useEffect } from 'react';

export default function Order() {
  const { cart } = useCart();
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart

  // check if cart is empty, if so, get the cart from the session storage
  useEffect(() => {
    if (cart.length === 0 && typeof window !== 'undefined') {
      const cartFromSession = JSON.parse(sessionStorage.getItem('cart'));
      if (cartFromSession) {
        changeCart.add2Cart(cartFromSession);
      }
    }
  }, []);

  let total = 0;
  cart.forEach((item) => {
    total += item.price / 100; // * item.quantity;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-4">Order Summary</h1>
      <div className="flex flex-col">
        <FoodListCart cart={cart} />
        <div className="flex justify-between">
          <p className="text-xl">Total</p>
          <p className="text-xl">{total.toFixed(2)}€</p>
        </div>
      </div>
    </div>
  );
}
