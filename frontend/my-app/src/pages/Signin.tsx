import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  onSigninSuccess: (user: User) => void;
}

export default function Signin({ onSigninSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:4000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      onSigninSuccess(data);
    } else {
      setError(data.message || 'Signin failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signin</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Signin</button>
    </form>
  );
}
