import { useState } from 'react';

interface Props {
  onSignupSuccess: () => void;
}

export default function Signup({ onSignupSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('Failed to parse JSON:', jsonErr);
        throw new Error('Invalid server response');
      }

      if (res.ok) {
        onSignupSuccess();
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
