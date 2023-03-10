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
    <div className="flex justify-center">
      <div className="flex flex-col h-screen w-screen max-w-xl font-serif p-4">
        <div>Il tuo ordine è in preparazione.</div>
        {/* TODO: list all the order for the specific user if he did more than one */}
        <div className="mt-auto flex w-full pb-4 justify-between gap-4">
          <button
            onClick={redirectToHome}
            className="bg-amber-500 py-2 px-4 rounded hover:bg-amber-600 grow"
          >
            Fai un nuovo ordine
          </button>
          {/* button to pay the bill */}
          <button
            className="bg-amber-500 py-2 px-4 rounded hover:bg-amber-600 grow"
            //onClick={window.alert('TODO: pay the bill')}
          >
            Paga ora
          </button>
        </div>
      </div>
    </div>
  );
}

// getserversideprops to initialize stripe payment intent
// also retrieve the order from the database and display it to the user

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
