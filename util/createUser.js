import { v4 as uuidv4 } from 'uuid';

export default async function createUser() {
  const token = uuidv4();
  try {
    await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gtfm_token: token,
      }),
    });
    return token;
  } catch (err) {
    console.error(err);
    return false;
  }
}
