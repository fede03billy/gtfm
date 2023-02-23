// order page where you can see the summary and total of your order from the cart context
// Path: pages/order.js

import { useCart, useCartUpdate } from '../components/cartContext';

export default function Order() {
  const { cart } = useCart();
  const changeCart = useCartUpdate();

  // check if cart is empty, if so, look in the session storage and parse the json from the string
  if (cart.length === 0 && typeof window !== 'undefined') {
    const cartFromSessionStorage = JSON.parse(sessionStorage.getItem('cart'));
    if (cartFromSessionStorage) {
      changeCart.add2Cart(cartFromSessionStorage);
    }
  }

  let total = 0;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-4">Order Summary</h1>
      <div className="flex flex-col">
        {cart.map((item, index) => {
          total += item.price / 100;
          return (
            <div key={index} className="flex justify-between">
              <p className="text-xl">
                {item.name} - {item.price / 100}€
              </p>
              {/* <p className="text-xl">{item.quantity}</p> */}
            </div>
          );
        })}
        <div className="flex justify-between">
          <p className="text-xl">Total</p>
          <p className="text-xl">{total.toFixed(2)}€</p>
        </div>
      </div>
    </div>
  );
}
