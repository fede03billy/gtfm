// order page where you can see the summary and total of your order from the cart context
// Path: pages/order.js

import { useCart, useCartUpdate } from '../components/cartContext';
import FoodListCart from '../components/foodListCart';
import { useMemo, useState, useEffect } from 'react';

export default function Order() {
  const { cart } = useCart();
  // const changeCart = useCartUpdate();

  // // check if cart is empty, if so, get the cookie with the cart if any
  // if (cart.length === 0) {
  //   const cookie = document.cookie.split(';').find((c) => c.includes('cart='));
  //   if (cookie) {
  //     const cartCookie = JSON.parse(cookie.split('=')[1]);
  //     changeCart.add2Cart(cartCookie);
  //   }
  // }

  // const [cartData, setCartData] = useState(null);

  // useEffect(() => {
  //   async function fetchCartData() {
  //     const cart = await fetch('/api/cart').then((res) => res.json());
  //     setCartData(cart);
  //   }
  //   fetchCartData();
  // }, []);

  // if (!cartData) {
  //   return <div>Loading...</div>;
  // }

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
