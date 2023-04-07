// component to add items to cart
// Path: components/add2Cart.js

import Image from 'next/image';
import { useCartUpdate } from './cartContext';

export default function Add2CartButton(props) {
  const { item } = props;
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart

  return (
    <div className="add-button">
      <button
        className="backdrop-blur-lg bg-white bg-opacity-50 p-4 rounded hover:bg-opacity-70 aspect-square"
        onClick={() => {
          changeCart.add2Cart(item);
        }}
      >
        <Image
          src="https://www.svgrepo.com/show/61879/add-to-cart.svg"
          height={25}
          width={25}
          alt="Add to cart"
        />
      </button>
    </div>
  );
}
