// component to add items to cart
// Path: components/add2Cart.js

import { useCartUpdate } from './cartContext';

export default function Add2CartButton(props) {
  const { item } = props;
  const changeCart = useCartUpdate(); // this one has two functions: add2Cart and removeFromCart

  return (
    <div>
      <button
        className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1"
        onClick={() => {
          changeCart.add2Cart(item);
        }}
      >
        {' '}
        Add to cart{' '}
      </button>
    </div>
  );
}
