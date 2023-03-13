// route that take the order and send it to the database

import Order from '../../../models/order.js';

export default async function handler(req, res) {
  // Get the restaurant_id, table_id and cart from the body
  const { restaurant_id, table_id, cart, user_id, total_price } = req.body;

  if (!restaurant_id || !table_id || !cart || !user_id || !total_price)
    return res.status(400).json({ error: 'Missing parameters' });

  // Get the data from the API, search for all the food that belongs to the restaurant with the restaurant_id
  try {
    // create the order
    const order = await Order.create({
      restaurant_id,
      table_id,
      ordered_food: cart.map((item) => item._id),
      user_id,
      total_price: total_price * 100,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
