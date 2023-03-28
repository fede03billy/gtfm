// component to display the cart in the order page, it shows the name, price, quantity and remove button of each item in the cart
// Path: components/cart.js

import RemoveFromCartButton from './removeFromCartButton';

export default function FoodItemCart(props) {
  const { item, index } = props;

  return (
    <div key={index} className="flex justify-between mb-4">
      <div className="flex flex-col">
        <div className="text-xl font-subtitle">
          {item.name} ({item.quantity})
        </div>
        <div className="text-md">
          {((item.price * item.quantity) / 100).toFixed(2)}€
        </div>
      </div>
      <RemoveFromCartButton item={item} />
    </div>
  );
}
