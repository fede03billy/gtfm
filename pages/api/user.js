// api route to create a new user with the token
// pages/api/user.js

import User from '../../models/user.js';
import databaseConnection from '../../util/databaseConnection.js';

databaseConnection();

async function createUser(token) {
  const user = await User.create({ token });
  console.log(user);
  return user;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body);
    try {
      const { gtfm_token } = req.body;
      const user = await createUser(gtfm_token);
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
