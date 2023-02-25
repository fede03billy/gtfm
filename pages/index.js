import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Categories from '../components/categories';
import FoodList from '../components/foodList';
import Link from 'next/link';
import { useCart } from '../components/cartContext';

export default function Home(props) {
  const { table_id, food } = props;
  const { cart } = useCart();

  // in this part of the code the category provider is not initialized yet,
  // so we cannot use the context, the category is initialized in the FoodList component

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          {
            `TAVOLO ${table_id}` /* To display the correct number of the table for the user we will find the index of the table_id in the restaurant schema's tables array */
          }
        </div>
        <Categories food={food} />
        <FoodList food={food} />
      </main>
      <footer className={styles.footer}>
        {/* button to redirect to /order */}
        <Link href="/order">
          <button
            className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1"
            onClick={() => {
              // save the cart in the session storage
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('cart', JSON.stringify(cart));
              }
            }}
          >
            Order
          </button>
        </Link>
      </footer>
    </div>
  );
}

// We need a function to get the query parameter from the url and to retrieve the data from the API
export async function getServerSideProps(context) {
  // Get the params from the url
  const { query } = context;
  let restaurant_id = query.resid;
  let table_id = query.tabid;

  // Get the data from the API
  const res = await fetch(
    `http://localhost:3000/api/restaurant/${restaurant_id}`
  ) // TODO: change the url to the production url
    .then((res) => res.json());

  // Return the data as props
  return {
    props: {
      table_id,
      food: res,
    },
  };
}
