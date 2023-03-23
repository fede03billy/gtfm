import Head from 'next/head';
import Categories from '../components/categories';
import FoodList from '../components/foodList';
import Link from 'next/link';
import { useCart } from '../components/cartContext';
import Error from 'next/error';
import { useEffect, useState } from 'react';
import createUser from '../util/createUser.js';
import { v4 as uuidv4 } from 'uuid';

export default function Home(props) {
  const { restaurantInfo, restaurant_id, table_id, food } = props;
  const { cart } = useCart();
  const orderLink = `/order?resid=${restaurant_id}&tabid=${table_id}`;
  const confirmLink = `/confirmation?resid=${restaurant_id}&tabid=${table_id}`;
  const [activeOrder, setActiveOrder] = useState(false);

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

  // check if there's a token in the cookie, if not we create a uuid and save it in the cookie, and also in the database as a user
  useEffect(() => {
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
  }, []);

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

        <main className="flex flex-col align-top mb-[70px]">
          <div className="sticky top-0 z-10 bg-amber-50 pt-4">
            {' '}
            {/* Container sticky for restaurant title and category list */}
            <div className="flex justify-between text-4xl font-bold mb-4 px-4">
              <div>{`${restaurantInfo.name}`}</div>
              <div className="font-medium text-lg">{`${table_id}`}</div>
            </div>
            <Categories food={food} />
          </div>
          <FoodList food={food} />
        </main>

        <footer className="fixed bottom-0 left-0 w-full flex flex-row justify-center align-center bg-amber-50 ">
          <div className="footerContainer flex flex-row py-4 px-4 sm:px-0 max-w-xl w-full">
            {activeOrder && (
              <Link href={confirmLink} className="w-full mr-4">
                <button
                  id="ordiniAttivi"
                  className="bg-amber-50 border w-full border-amber-500 py-2 px-4 rounded hover:bg-amber-100 inline"
                >
                  Ordini Attivi
                </button>
              </Link>
            )}
            {/* {activeOrder && (
              <Link href={orderLink}>
                <button
                  id="ordine"
                  className="bg-amber-500 inline py-2 px-4 rounded hover:bg-amber-600 w-50%"
                  onClick={() => {
                    // save the cart in the session storage
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('cart', JSON.stringify(cart));
                    }
                  }}
                >
                  {`Ordine (${cart.length})`}
                </button>
              </Link>
            )} */}
            <Link href={orderLink} className="w-full">
              <button
                id="ordine"
                className="bg-amber-500 w-full py-2 px-4 grow rounded hover:bg-amber-600 inline"
                onClick={() => {
                  // save the cart in the session storage
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                  }
                }}
              >
                Ordine&nbsp;
                {cart.length !== 0 && (
                  <span className="inline-flex items-center justify-center mb-1 h-5 w-5 rounded-full bg-red-600 bg-center text-white text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
            </Link>
          </div>
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
