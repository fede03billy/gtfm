// component of the button that removes the item from the cart in the order page, using the removeFromCart function from the cartContext
// Path: components/removeFromCartButton.js

import { useCart, useCartUpdate } from './cartContext';
import Image from 'next/image';

export default function RemoveFromCartButton(props) {
  const { item } = props;
  const { cart } = useCart();
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart

  return (
    <div>
      <button
        className="need-interaction bg-amber-300 py-2 px-4 rounded hover:bg-amber-400 h-full aspect-square"
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
        <Image
          src="https://www.svgrepo.com/show/502609/delete-1.svg"
          height={25}
          width={25}
          alt="Remove from cart"
        />
      </button>
    </div>
  );
}
