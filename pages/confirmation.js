// page where the user wait for the food, order other food or pay the bill
// Path: pages/waiter.js

import { useRouter } from 'next/router';
import { useCartUpdate } from '../components/cartContext';

export default function Waiter() {
  const router = useRouter();
  const changeCart = useCartUpdate();
  const { resid, tabid } = router.query;
  const restaurant_id = resid;
  const table_id = tabid;

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

  return (
    <div className="flex-col">
      <h1>Waiter</h1>
      {/* TODO: list all the order for the specific user if he did more than one */}
      {/* button go to home page to order again */}
      <button
        onClick={redirectToHome}
        className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 mr-1"
      >
        Ordina di nuovo
      </button>
      {/* button to pay the bill */}
      <button
        className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 mr-1"
        //onClick={window.alert('TODO: pay the bill')}
      >
        Pagare ora
      </button>
    </div>
  );
}

// getserversideprops to initialize stripe payment intent

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   const { client_secret } = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'eur',
//   });

//   return {
//     props: {
//       client_secret,
//     },
//   };
// }
