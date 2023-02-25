// component to display the cart in the order page, it shows the name, price, quantity and remove button of each item in the cart
// Path: components/cart.js

import RemoveFromCartButton from './removeFromCartButton';

export default function FoodItemCart(props) {
  const { item, index } = props;

  return (
    <div className="flex flex-col">
      <div key={index} className="flex justify-between">
        <p className="text-xl">
          {item.name} - {item.price / 100}€
        </p>
        {/* <p className="text-xl">{item.quantity}</p> */}
        <RemoveFromCartButton item={item} />
      </div>
    </div>
  );
}
