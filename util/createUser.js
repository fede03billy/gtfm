export default async function createUser(token) {
  await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gtfm_token: token,
    }),
  }).catch((err) => console.error(err));
  console.info('Nuovo utente creato.');
  return;
}
