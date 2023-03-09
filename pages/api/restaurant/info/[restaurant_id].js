import Restaurant from '../../../../models/restaurant.js';
import databaseConnection from '../../../../util/databaseConnection.js';

databaseConnection();

export default async function handler(req, res) {
  // Get the restaurant_id from the query parameter
  const restaurant_id = req.query?.restaurant_id;

  // Get the data from the API, search for all the food that belongs to the restaurant with the restaurant_id
  try {
    const restaurantInfo = await Restaurant.findOne({ _id: restaurant_id });
    res.status(200).json(restaurantInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
