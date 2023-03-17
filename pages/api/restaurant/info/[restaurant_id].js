import Restaurant from '../../../../models/restaurant.js';
import databaseConnection from '../../../../util/databaseConnection.js';

export default async function handler(req, res) {
  // Get the restaurant_id from the query parameter
  const restaurant_id = req.query?.restaurant_id;
  // clean restaurant_id of the quotes and spaces
  restaurant_id = restaurant_id.replace(/['"]+/g, '').trim();
  try {
    await databaseConnection();
    const restaurantInfo = await Restaurant.findOne({ _id: restaurant_id });
    res.status(200).json(restaurantInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
