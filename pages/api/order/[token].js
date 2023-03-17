// handler to get the order by the token
//
import Order from '../../../models/order.js';
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

    if (!user) return res.status(203).json({ message: 'User not found' });
    // format the user id from `new ObjectId("640f51bb1ea6d504fae8def8")` to 640f51bb1ea6d504fae8def8 with a replace
    const userId = user._id.toString().replace(/new ObjectId\(\"$1\"\)/g, '$1');

    // create the order
    const orders = await Order.find({
      user_id: userId,
      done: false,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
