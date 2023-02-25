// export Food List component made of Food Item components
// Path: components/foodList.js
import { useCart } from './cartContext';
import FoodItemCart from './foodItemCart';
import { useEffect } from 'react';

export default function FoodList(props) {
  const { cart } = props;

  return (
    <div>
      {cart.map((item, index) => {
        return <FoodItemCart item={item} key={index} />;
      })}
    </div>
  );
}
