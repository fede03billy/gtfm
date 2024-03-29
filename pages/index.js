import Head from 'next/head';
import Categories from '../components/categories';
import FoodList from '../components/foodList';
import FoodListCart from '../components/foodListCart';
import Link from 'next/link';
import { useCart } from '../components/cartContext';
import Error from 'next/error';
import { useState, useEffect, useRef } from 'react';
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
  const noteRef = useRef(null);

  const handleDrag = (e, newPosition) => {
    setPosition({ y: newPosition.y });
  };

  const handleStop = () => {
    const snapThreshold = 225;
    const upperPosition = 0;
    const lowerPosition = -450;

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

  function toggleDrawer(y) {
    const newPosition = y === 0 ? -450 : 0;
    const element = document.getElementById('footer-card');
    element.style.transition = 'all 0.3s ease-out'; // snap smoothly to the top or bottom
    setPosition({ y: newPosition });
    const bg = document.getElementById('darken-bg');
    bg.classList.toggle('bg-opacity-30');
    bg.classList.toggle('bg-opacity-0');
    bg.classList.toggle('pointer-events-none');
    setTimeout(() => {
      element.style.transition = 'none';
    }, 300);
    if (document.body.style.overflow === 'auto') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  function splitButtons() {
    const button = document.getElementById('ordine');
    const closeButton = document.getElementById('close-button');
    setTimeout(() => {
      closeButton.style.opacity = '1';
    }, 50);
    button.style.width = '48%';
    closeButton.style.zIndex = '0';
  }

  function hideButtons() {
    const button = document.getElementById('ordine');
    const closeButton = document.getElementById('close-button');
    button.style.width = '100%';
    closeButton.style.zIndex = '-1';
    closeButton.style.opacity = '0';
  }

  // function to send the order to the API
  async function sendOrder() {
    if (position.y !== -450) {
      toggleDrawer(position.y);
      splitButtons();
      return;
    }

    if (cart?.length === 0 || !cart) {
      window.alert('Il carrello è vuoto');
      return;
    }

    setLoading(true);

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
      setLoading(false);
      return;
    }

    const confirm = window.confirm("Inviare l'ordine?");
    if (confirm) {
      const total_price =
        typeof total == 'number'
          ? total.toFixed(2)
          : parseFloat(total).toFixed(2);
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
          note: noteRef.current.value,
        }),
      });
      // if the order is sent successfully, clear the cart
      if (res.status === 200) {
        // give the body the overflow auto in case some button magic removed it by mistake
        document.body.style.overflow = 'auto';
        // redirect user to the home page
        router.push(`/confirmation?resid=${restaurant_id}&tabid=${table_id}`);
        setLoading(false);
      } else {
        window.alert('Si è verificato un errore');
        setLoading(false);
      }
    } else {
      setLoading(false);
      return;
    }
  }

  useEffect(() => {
    setTotal(getTotalPrice());
  }, [cart]);

  // check if there's a token in the cookie, if not we create a uuid and save it in the cookie, and also in the database as a user
  if (typeof window !== 'undefined' || typeof document !== 'undefined') {
    if (!table_id) {
      const footer = document.getElementsByTagName('footer')[0];
      footer?.classList.add('hidden');
    }

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

  // check if there are no restaurant_id, in that case we will show a 404 page
  if (!restaurant_id) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="flex justify-center">
      <div className="mainContainer flex flex-col h-full min-h-screen w-full max-w-xl font-helvetica">
        <Head>
          <title>GTFM</title>
          <meta name="description" content="Generated by create next app" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main id="main" className="flex flex-col align-top mb-[100px]">
          <div className="sticky top-0 bg-white bg-opacity-30 backdrop-blur-lg pt-4 w-screen px-4 z-50 shadow-md max-w-xl">
            {/* Container sticky for restaurant title and category list */}
            <div className="flex justify-between text-4xl font-bold mb-4 px-4">
              <div
                id="restaurantName"
                className="max-w-[450px] max-h-10 overflow-hidden"
              >
                {restaurantInfo.name}
              </div>
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
          // currently disabled switch bg-transparent to bg-black to enable
          id="darken-bg"
          onClick={() => {
            toggleDrawer(position.y);
          }}
          className="h-screen w-screen fixed top-0 left-0 bg-transparent bg-opacity-0 transition pointer-events-none"
        ></div>
        <footer className="fixed bottom-0 left-0 w-full flex flex-row justify-center align-center z-50">
          <Draggable
            axis="y"
            bounds={{ top: -450, bottom: 0 }}
            position={{ x: 0, y: position.y }}
            onDrag={handleDrag}
            onStop={handleStop}
            cancel={'.need-interaction'}
          >
            <div
              id="footer-card"
              className="footerContainer flex flex-col items-center py-4 px-4 sm:px-0 max-w-xl w-full fixed left-0 bottom-[-520px] h-[600px] bg-white bg-opacity-30 backdrop-blur-lg z-50"
            >
              <div className="footerHandle w-10 rounded-full bg-white bg-opacity-80 h-1.5 mb-2 my-[-6px]"></div>
              <div
                className="w-full flex flex-row justify-end gap-4 relative"
                id="button-container"
              >
                <button
                  id="close-button"
                  className="need-interaction font-subtitle shadow h-10 py-2 px-4 rounded hover:bg-white hover:bg-opacity-50 cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={() => {
                    toggleDrawer(position.y);
                    hideButtons();
                  }}
                >
                  Chiudi
                </button>
                <button
                  id="ordine"
                  className="need-interaction font-subtitle bg-white bg-opacity-50 backdrop-blur-lg shadow w-full h-10 py-2 px-4 rounded hover:bg-opacity-70 inline-flex flex-row justify-center cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={() => {
                    sendOrder();
                  }}
                >
                  <div>
                    {loading
                      ? 'Caricamento...'
                      : position.y === -450
                      ? cart.length > 0
                        ? 'Conferma'
                        : 'Ordina'
                      : 'Ordina'}
                  </div>
                  {cart.length !== 0 && (
                    <div className="inline-flex items-center justify-center h-4 w-4 ml-1 mt-1 rounded-full bg-red-600 bg-center text-white text-xs">
                      {cart.length}
                    </div>
                  )}
                </button>
              </div>
              {cart.length > 0 ? (
                <div className="flex flex-col rounded p-4 bg-white bg-opacity-30 backdrop-blur-lg shadow my-4 w-full">
                  <FoodListCart cart={cart} />
                  <input
                    name="note"
                    type="text"
                    ref={noteRef}
                    placeholder="Note"
                    className="need-interaction rounded bg-white bg-opacity-50 backdrop-blur-lg py-2 px-4 mt-4 text-sm"
                  ></input>
                  <div className="h-px bg-amber-900 my-4"></div>
                  <div className="flex justify-between">
                    <p className="text-xl">Total</p>
                    <p className="text-xl">{total}€</p>
                  </div>
                </div>
              ) : (
                <div className="text-black opacity-30 mt-52 text-sm font-thin">
                  Non c&apos;è nulla nel tuo carrello.
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

  if (!restaurant_id) {
    return {
      props: {},
    };
  }

  if (!table_id) {
    table_id = null;
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
