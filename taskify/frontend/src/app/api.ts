export async function login(email: string, password: string) {
  const res = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(email: string, password: string, firstName: string, lastName: string) {
  const res = await fetch('http://localhost:3001/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  return res.json();
}

export async function getProfile(token: string) {
  const res = await fetch('http://localhost:3001/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return res.json();
} 