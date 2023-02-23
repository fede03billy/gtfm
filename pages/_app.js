import '../styles/globals.css';
import { CategoriesProvider } from '../components/categoriesContext';
import { CartProvider } from '../components/cartContext';

function MyApp({ Component, pageProps }) {
  return (
    <CategoriesProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </CategoriesProvider>
  );
}

export default MyApp;
