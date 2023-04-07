// page where the user wait for the food, order other food or pay the bill
// Path: pages/waiter.js

import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCartUpdate } from '../components/cartContext';
import Order from '../components/order.js';

export default function Waiter() {
  const router = useRouter();
  const changeCart = useCartUpdate();
  const { resid, tabid } = router.query;
  const restaurant_id = resid;
  const table_id = tabid;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function redirectToHome() {
    setLoading(true);
    // empty the cart in the context
    changeCart.clearCart();
    // remove the cart from the session storage
    window.sessionStorage.removeItem('cart');
    // redirect user to the home page for a new order
    await router.push(`/?resid=${restaurant_id}&tabid=${table_id}`); // this redirect take almost 1 full second...
    setLoading(false);
  }

  function renderOrders(orders) {
    return orders.map((order) => {
      return <Order key={order._id} order={order} />;
    });
  }

  // get the cookie with the user gtfm_token
  if (typeof window !== 'undefined') {
    let token;
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

    if (token) {
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
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col h-[90vh] w-screen max-w-xl font-serif p-4 mb-[70px]">
        <div>
          <div className="flex flex-row w-full justify-center">
            <img
              src="https://www.svgrepo.com/show/497435/receipt-item.svg"
              className="w-8 h-8 mr-2"
            />
            <h1 className="text-2xl font-title text-center">I tuoi ordini</h1>
          </div>
          {orders.length > 0 && renderOrders(orders)}
        </div>

        <footer
          id="footer-buttons"
          className="fixed bottom-0 left-0 w-full flex flex-row justify-center align-center bg-white bg-opacity-30 backdrop-blur-lg"
        >
          <div className="footerContainer flex flex-row py-4 px-4 sm:px-0 max-w-xl w-full">
            <button
              onClick={redirectToHome}
              className="bg-white shadow bg-opacity-50 backdrop-blur-lg py-2 px-4 rounded hover:bg-opacity-70 grow mr-4 font-subtitle"
              disabled={loading}
            >
              {loading ? 'Caricamento...' : 'Fai un nuovo ordine'}
            </button>
            {/* button to pay the bill */}
            <button
              className="bg-white shadow bg-opacity-30 backdrop-blur-lg py-2 px-4 rounded grow opacity-30 font-subtitle"
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
