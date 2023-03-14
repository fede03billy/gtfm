// component to show the order summary in the confirmation page

import { useEffect, useState } from 'react';
import FoodListCart from './foodListCart.js';

export default function Order({ order }) {
  const [food, setFood] = useState([]);
  useEffect(() => {
    // with this use effect we will retrieve the food from the database and show it in the order summary
    // we will use the food id in the ordered_food property of order
    async function getFood(food_array) {
      const food = await fetch('/api/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ordered_food: food_array,
        }),
      })
        .then((res) => res.json())
        .then((res) => setFood(res.food));
    }
    getFood(order.ordered_food);
  }, []);

  return (
    <div className="bg-amber-100 p-4 mb-4">
      <h1>Order summary</h1>
      <p>Order id: {order._id}</p>
      <p>Table id: {order.table_id}</p>
      <FoodListCart cart={food} />
    </div>
  );
}
