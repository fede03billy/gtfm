// route that get the token from the query params, search the db for the user-_id and returns it

import User from '../../../models/user.js';
import databaseConnection from '../../../util/databaseConnection.js';

databaseConnection();

export default async function handler(req, res) {
  // get the token from the params
  const { token } = req.query;

  if (!token) return res.status(400).json({ error: 'Missing parameters' });

  // Get the data from the API, search for all the food that belongs to the restaurant with the restaurant_id
  try {
    // get the user from the token
    const user = await User.findOne({ token });
    res.status(200).json({ success: true, user_id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
