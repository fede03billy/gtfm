import '../styles/globals.css';
import { CategoriesProvider } from '../components/categoriesContext';
import { CartProvider } from '../components/cartContext';
import { Suspense } from 'react';
import Loading from '../components/loading';

function MyApp({ Component, pageProps }) {
  return (
    <CategoriesProvider>
      <CartProvider>
        <Suspense fallback={<Loading />}>
          <Component {...pageProps} />
        </Suspense>
      </CartProvider>
    </CategoriesProvider>
  );
}

export default MyApp;
