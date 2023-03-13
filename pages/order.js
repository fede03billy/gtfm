// order page where you can see the summary and total of your order from the cart context
// Path: pages/order.js

import { useCart, useCartUpdate } from '../components/cartContext';
import FoodListCart from '../components/foodListCart';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import createUser from '../util/createUser';
import { v4 as uuidv4 } from 'uuid';

export default function Order() {
  const router = useRouter();
  const { cart } = useCart();
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart
  const restaurant_id = router.query.resid;
  const table_id = router.query.tabid;

  // function to send the order to the API
  async function sendOrder() {
    const cart = JSON.parse(sessionStorage.getItem('cart')); // get the cart from the session storage
    if (cart?.length === 0 || !cart) {
      window.alert('Il carrello è vuoto');
      return;
    }

    if (!document.cookie.includes('gtfm_token')) {
      // the cookie doesn't exist, so we create it
      const token = uuidv4();
      createUser(token);
      if (!token) {
        window.alert('Si è verificato un errore');
        return;
      }
      document.cookie = `gtfm_token=${token};`;
    }

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('gtfm_token'))
      .split('=')[1];

    const { user_id } = await fetch(`/api/user/${token}`)
      .then((res) => res.json())
      .catch((err) => console.error(err));

    if (!user_id) {
      window.alert(
        'Non è stato possibile identificare il tuo ordine, chiedi allo staff se è stato ricevuto.'
      );
      return;
    }

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

  // function to go back to the home page
  function getBack() {
    router.push(`/?resid=${restaurant_id}&tabid=${table_id}`);
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
    <div className="flex justify-center">
      <div className="flex flex-col container h-screen w-screen max-w-xl font-serif p-4">
        <div className="flex justify-between text-4xl font-bold mb-4 px-4">
          <div>Ordine</div>
          <div className="font-medium text-lg">{`${table_id}`}</div>
        </div>
        <div className="flex flex-col rounded p-4 bg-amber-100 mb-4">
          <FoodListCart cart={cart} />
          <div className="h-px bg-amber-900 my-4"></div>
          <div className="flex justify-between">
            <p className="text-xl">Total</p>
            <p className="text-xl">{total.toFixed(2)}€</p>
          </div>
        </div>
        <div className="mt-auto w-full flex pb-4 justify-between gap-4">
          <button
            className="bg-amber-500 hover:bg-amber-600 py-2 px-4 rounded grow"
            onClick={getBack}
          >
            Ordina altro
          </button>
          <button
            className="bg-amber-500 py-2 px-4 rounded hover:bg-amber-600 grow"
            onClick={sendOrder}
          >
            Invia l'ordine
          </button>
        </div>
      </div>
    </div>
  );
}
