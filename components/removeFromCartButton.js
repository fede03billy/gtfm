// component of the button that removes the item from the cart in the order page, using the removeFromCart function from the cartContext
// Path: components/removeFromCartButton.js

import { useCart, useCartUpdate } from './cartContext';

export default function RemoveFromCartButton(props) {
  const { item } = props;
  const { cart } = useCart();
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart

  return (
    <div>
      <button
        className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1"
        onClick={() => {
          changeCart.removeFromCart(item);
          if (typeof window !== 'undefined') {
            const cart2save = cart.filter(
              (cartItem) => cartItem._id !== item._id
            );
            sessionStorage.setItem('cart', JSON.stringify(cart2save));
          }
        }}
      >
        Remove
      </button>
    </div>
  );
}
