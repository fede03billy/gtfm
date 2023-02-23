// component to display the cart in the order page, it shows the name, price, quantity and remove button of each item in the cart
// Path: components/cart.js

import { useCart } from './cartContext';
import RemoveFromCartButton from './removeFromCartButton';

export default function FoodItemCart() {
  const { cart } = useCart();

  return (
    <div className="flex flex-col">
      {cart.map((item, index) => {
        return (
          <div key={index} className="flex justify-between">
            <p className="text-xl">
              {item.name} - {item.price / 100}€
            </p>
            {/* <p className="text-xl">{item.quantity}</p> */}
            <RemoveFromCartButton item={item} />
          </div>
        );
      })}
    </div>
  );
}
