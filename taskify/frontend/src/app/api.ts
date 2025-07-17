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

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profile: string | null;
  bio?: string | null;
  phone?: string | null;
  country?: string | null;
};

export async function getProfile(token: string): Promise<User> {
  const res = await fetch('http://localhost:3001/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch('http://localhost:3001/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch('http://localhost:3001/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  return res.json();
}

export async function createTask(task: any, token: string) {
  const res = await fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function getTasks(token: string) {
  const res = await fetch('http://localhost:3001/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function updateTask(id: number, updates: any, token: string) {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: number, token: string) {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function getTasksByState(token: string) {
  const res = await fetch(`http://localhost:3001/tasks/by-state`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch tasks by state');
  return res.json();
}

export async function updateProfile(profile: any, token: string) {
  const res = await fetch('http://localhost:3001/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
} 