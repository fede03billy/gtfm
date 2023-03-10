// order page where you can see the summary and total of your order from the cart context
// Path: pages/order.js

import { useCart, useCartUpdate } from '../components/cartContext';
import FoodListCart from '../components/foodListCart';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Order() {
  const router = useRouter();
  const { cart } = useCart();
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart

  // function to send the order to the API
  async function sendOrder() {
    const cart = JSON.parse(sessionStorage.getItem('cart')); // get the cart from the session storage
    if (cart?.length === 0 || !cart) {
      window.alert('Il carrello è vuoto');
      return;
    }
    // get the table_id from the query parameter
    const table_id = router.query.tabid;
    const user_id = 'test01'; // TODO: get the user token from the cookie and the user_id from the database
    // get the restaurant_id from the query parameter
    const restaurant_id = router.query.resid;

    const total_price = total.toFixed(2);
    // send the order to the API
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurant_id,
        table_id,
        cart,
        user_id,
        total_price,
      }),
    });
    // if the order is sent successfully, clear the cart
    if (res.status === 200) {
      // redirect user to the home page
      router.push(`/confirmation?resid=${restaurant_id}&tabid=${table_id}`);
    } else {
      window.alert('Si è verificato un errore');
    }
  }

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
      {/* Let's make a button to pay the order */}
      <button
        className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 mr-1"
        onClick={sendOrder}
      >
        Pagare
      </button>
    </div>
  );
}
