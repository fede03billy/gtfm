import Head from 'next/head';
import Categories from '../components/categories';
import FoodList from '../components/foodList';
import FoodListCart from '../components/foodListCart';
import Link from 'next/link';
import { useCart } from '../components/cartContext';
import Error from 'next/error';
import { useState, useEffect } from 'react';
import createUser from '../util/createUser.js';
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'react-draggable';
import { useRouter } from 'next/router';

export default function Home(props) {
  const { restaurantInfo, restaurant_id, table_id, food } = props;
  const { cart } = useCart();
  const router = useRouter();
  const confirmLink = `/confirmation?resid=${restaurant_id}&tabid=${table_id}`;
  const [activeOrder, setActiveOrder] = useState(false);
  const [position, setPosition] = useState({ y: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e, newPosition) => {
    setPosition({ y: newPosition.y });
  };

  const handleStop = () => {
    const snapThreshold = 200;
    const upperPosition = 0;
    const lowerPosition = -400;

    // add transition to the element
    const element = document.getElementById('footer-card');
    element.style.transition = 'all 0.3s ease-out'; // snap smoothly to the top or bottom

    if (Math.abs(position.y - upperPosition) < snapThreshold) {
      setPosition({ y: upperPosition });
      const bg = document.getElementById('darken-bg');
      bg.classList.remove('bg-opacity-30');
      bg.classList.add('bg-opacity-0');
      bg.classList.add('pointer-events-none');
      document.body.style.overflow = 'auto';
    } else if (Math.abs(position.y - lowerPosition) < snapThreshold) {
      setPosition({ y: lowerPosition });
      const bg = document.getElementById('darken-bg');
      bg.classList.remove('bg-opacity-0');
      bg.classList.add('bg-opacity-30');
      bg.classList.remove('pointer-events-none');
      document.body.style.overflow = 'hidden';
    }

    // remove transition after the element has been moved
    setTimeout(() => {
      element.style.transition = 'none';
    }, 300);
  };

  // in this part of the code the category provider is not initialized yet,
  // so we cannot use the context, the category is initialized in the FoodList component

  async function checkActiveOrders(token) {
    await fetch(`/api/order/${token}`)
      .then((res) => res.json())
      .then((data) => {
        let { orders } = data;
        if (orders.length > 0) {
          setActiveOrder(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getTotalPrice() {
    let total = 0;
    cart.forEach((item) => {
      total += item.price / 100; // here we do not account for the quantity
    });
    return total.toFixed(2);
  }

  // function to send the order to the API
  async function sendOrder() {
    if (cart?.length === 0 || !cart) {
      window.alert('Il carrello è vuoto');
      return;
    }

    if (position.y !== -400) {
      const element = document.getElementById('footer-card');
      element.style.transition = 'all 0.3s ease-out'; // snap smoothly to the top or bottom
      setPosition({ y: -400 });
      const bg = document.getElementById('darken-bg');
      bg.classList.remove('bg-opacity-30');
      bg.classList.add('bg-opacity-0');
      bg.classList.add('pointer-events-none');
      setTimeout(() => {
        element.style.transition = 'none';
      }, 300);
      return;
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

    const confirm = window.confirm("Inviare l'ordine?");
    if (confirm) {
      const total_price =
        typeof total == 'number'
          ? total.toFixed(2)
          : parseFloat(total).toFixed(2);
      setLoading(true);
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
        setLoading(false);
      } else {
        window.alert('Si è verificato un errore');
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    setTotal(getTotalPrice());
  }, [cart]);

  // check if there's a token in the cookie, if not we create a uuid and save it in the cookie, and also in the database as a user
  if (typeof window !== 'undefined' || typeof document !== 'undefined') {
    if (document.cookie.includes('gtfm_token')) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('gtfm_token='))
        .split('=')[1]
        .replace(/['"]+/g, '')
        .trim();
      checkActiveOrders(token);
      if (!token) {
        const token = uuidv4();
        document.cookie = `gtfm_token=${token};`;
        createUser(token).catch((err) => {
          console.error(err);
        });
        checkActiveOrders(token);
      }
    } else {
      const token = uuidv4();
      document.cookie = `gtfm_token=${token};`;
      createUser(token).catch((err) => {
        console.error(err);
      });
    }
  }

  // check if there are no restaurant_id and table_if, in that case we will show a 404 page
  if (!restaurant_id || !table_id) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="flex justify-center">
      <div className="mainContainer flex flex-col h-full w-full max-w-xl bg-amber-50 font-serif">
        <Head>
          <title>GTFM</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main id="main" className="flex flex-col align-top mb-[70px]">
          <div className="sticky top-0 bg-amber-50 pt-4 w-screen px-4 z-50 shadow-md max-w-xl">
            {/* Container sticky for restaurant title and category list */}
            <div className="flex justify-between text-4xl font-bold mb-4 px-4">
              <div>{`${restaurantInfo.name}`}</div>
              {/* <div className="font-medium text-lg">Tavolo {`${table_id}`}</div> */}
              {activeOrder && (
                <Link href={confirmLink}>
                  <img
                    src="https://www.svgrepo.com/show/497435/receipt-item.svg"
                    className="w-8 h-8 ml-auto mt-1.5 mr-2"
                  />
                </Link>
              )}
            </div>
            <Categories food={food} />
          </div>
          <FoodList food={food} />
        </main>

        <div
          id="darken-bg"
          onClick={(e) => {
            const element = document.getElementById('footer-card');
            element.style.transition = 'all 0.3s ease-out'; // snap smoothly to the bottom
            setPosition({ y: 0 });
            setTimeout(() => {
              element.style.transition = 'none';
            }, 300);
            e.target.classList.add('bg-opacity-0');
            e.target.classList.remove('bg-opacity-30');
            e.target.classList.toggle('pointer-events-none');
            document.body.style.overflow = 'auto';
          }}
          className="h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-0 transition"
        ></div>
        <footer className="fixed bottom-0 left-0 w-full flex flex-row justify-center align-center bg-amber-50 z-50">
          <Draggable
            axis="y"
            bounds={{ top: -400, bottom: 0 }}
            position={{ x: 0, y: position.y }}
            onDrag={handleDrag}
            onStop={handleStop}
            cancel={'.need-interaction'}
          >
            <div
              id="footer-card"
              className="footerContainer flex flex-col items-center py-4 px-4 sm:px-0 max-w-xl w-full fixed left-0 bottom-[-420px] h-[500px] bg-amber-50 z-50"
            >
              <div className="footerHandle w-10 rounded-full bg-amber-300 h-1.5 mb-2 my-[-6px]"></div>
              <button
                id="ordine"
                className="need-interaction bg-amber-500 w-full h-10 py-2 px-4 rounded hover:bg-amber-600 inline-flex flex-row justify-center cursor-pointer"
                onClick={() => {
                  sendOrder();
                }}
              >
                <div>{loading ? 'Caricamento...' : 'Ordina'}</div>
                {cart.length !== 0 && (
                  <div className="inline-flex items-center justify-center h-4 w-4 ml-1 mt-1 rounded-full bg-red-600 bg-center text-white text-xs">
                    {cart.length}
                  </div>
                )}
              </button>
              {cart.length > 0 ? (
                <div className="flex flex-col rounded p-4 bg-amber-100 my-4 w-full">
                  <FoodListCart cart={cart} />
                  <div className="h-px bg-amber-900 my-4"></div>
                  <div className="flex justify-between">
                    <p className="text-xl">Total</p>
                    <p className="text-xl">{total}€</p>
                  </div>
                </div>
              ) : (
                <div className="text-black opacity-30 mt-44 text-sm">
                  Non c'è ancora nulla nel tuo carrello.
                </div>
              )}
            </div>
          </Draggable>
        </footer>
      </div>
    </div>
  );
}

// We need a function to get the query parameter from the url and to retrieve the data from the API
export async function getServerSideProps(context) {
  // Get the params from the url
  const { query } = context;
  let restaurant_id = query.resid;
  let table_id = query.tabid;

  if (!restaurant_id || !table_id) {
    return {
      props: {},
    };
  }

  // Get the data from the API
  const res = await fetch(
    `${process.env.BASE_URL}/api/restaurant/${restaurant_id}`
  ).then((res) => res.json());

  // Get the restaurant info from the API
  const restaurantInfo = await fetch(
    `${process.env.BASE_URL}/api/restaurant/info/${restaurant_id}`
  ).then((res) => res.json());

  // Return the data as props
  return {
    props: {
      restaurantInfo,
      restaurant_id, // TODO: avoid passing this data cause it is already in the restaurantInfo object
      table_id,
      food: res,
    },
  };
}
