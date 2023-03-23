// page where the user wait for the food, order other food or pay the bill
// Path: pages/waiter.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCartUpdate } from '../components/cartContext';
import Order from '../components/order.js';

export default function Waiter() {
  const router = useRouter();
  const changeCart = useCartUpdate();
  const { resid, tabid } = router.query;
  const restaurant_id = resid;
  const table_id = tabid;
  const [orders, setOrders] = useState([]);

  function redirectToHome() {
    // empty the cart in the context
    changeCart.clearCart();
    if (typeof window !== 'undefined') {
      // remove the cart from the session storage
      window.sessionStorage.removeItem('cart');
    }
    // redirect user to the home page for a new order
    router.push(`/?resid=${restaurant_id}&tabid=${table_id}`);
  }

  function renderOrders(orders) {
    return orders.map((order) => {
      return <Order key={order._id} order={order} />;
    });
  }

  useEffect(() => {
    // get the cookie with the user gtfm_token
    let token;
    if (typeof window !== 'undefined') {
      // check if the cookie exists
      if (!document.cookie.includes('gtfm_token')) {
        window.alert(
          "Non è stato possibile identificare il tuo ordine ma non ti preoccupare, è in preparazione. Questo potrebbe essere dovuto al fatto che hai delle estensioni del browser che impediscono l'utilizzo dei cookie."
        );
        return;
      }

      // parse the cookie
      token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('gtfm_token'))
        .split('=')[1];
    }
    if (typeof token === 'string') {
      // fetch the order from the server
      fetch(`/api/order/${token}`)
        .then((res) => res.json())
        .then((data) => {
          let { orders } = data;
          setOrders(orders);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.error(
        "Non è stato possibile identificare il tuo ordine ma non ti preoccupare, è in preparazione. Questo potrebbe essere dovuto al fatto che hai delle estensioni del browser che impediscono l'utilizzo dei cookie."
      );
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col h-screen w-screen max-w-xl font-serif p-4">
        <div>
          Il tuo ordine è in preparazione.
          <br />
          {orders.length > 0 && renderOrders(orders)}
        </div>

        <footer className="fixed bottom-0 left-0 w-full flex flex-row justify-center align-center bg-amber-50 ">
          <div className="footerContainer flex flex-row py-4 px-4 sm:px-0 max-w-xl w-full">
            <button
              onClick={redirectToHome}
              className="bg-amber-500 py-2 px-4 rounded hover:bg-amber-600 grow mr-4"
            >
              Fai un nuovo ordine
            </button>
            {/* button to pay the bill */}
            <button
              className="bg-amber-500 py-2 px-4 rounded grow opacity-30"
              disabled
              //onClick={window.alert('TODO: pay the bill')}
            >
              Paga ora
            </button>
          </div>
        </footer>
        <div className="mt-auto flex w-full pb-4 justify-between gap-4"></div>
      </div>
    </div>
  );
}
