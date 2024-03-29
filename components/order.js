// component to show the order summary in the confirmation page

import { useEffect, useState } from 'react';
import FoodListSummary from './foodListSummary.js';

export default function Order({ order }) {
  const [food, setFood] = useState([]);

  // retrieve the food from the database and show it in the order summary
  // we will use the food id in the ordered_food property of order
  async function getFood(food_array) {
    await fetch('/api/food', {
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

  useEffect(() => {
    getFood(order.ordered_food);
  }, []);

  return (
    <div className="bg-white bg-opacity-40 backdrop-blur-lg p-4 my-4 shadow rounded">
      <div className="flex justify-between mb-2 text-right">
        <h1 className="text-xl font-bold">Il tuo ordine</h1>
        <div className="text-xs">
          <p>
            <span>Tavolo</span> {order.table_id}
          </p>
          <p>
            Status:{' '}
            <span className="font-bold">
              {order.delivered
                ? order.paid
                  ? 'completo'
                  : 'da pagare'
                : 'in preparazione'}
            </span>
          </p>
          <p>
            <span>Ordine effettuato alle</span>{' '}
            {new Date(order.created_at).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <div className="border-b border-black border-opacity-20 my-4"></div>
      <FoodListSummary cart={food} />
      {order.note && (
        <p className="text-sm text-black opacity-40">Note: {order.note}</p>
      )}
      <p className="flex justify-between mt-2 font-bold">
        <span>Total:</span>
        <span>{(order.total_price / 100).toFixed(2)} €</span>
      </p>
    </div>
  );
}
