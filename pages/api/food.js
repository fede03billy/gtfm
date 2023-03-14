// route to convert the ordered_food array of ids to an array of objects (food)
import Food from '../../models/food.js';

export default async function handler(req, res) {
  // get the ordered_food array from the body
  const { ordered_food } = req.body;
  if (!ordered_food)
    return res.status(400).json({ error: 'Missing parameters' });

  // get the food from the database
  try {
    const food = await Food.find({ _id: { $in: ordered_food } });

    res.status(200).send({ food });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
