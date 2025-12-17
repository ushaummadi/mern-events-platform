import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fn = isSignup ? api.auth.signup : api.auth.login;
      const { data } = await fn(form);
      login({ user: data.user, token: data.token });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? 'Sign Up' : 'Login'}
        </h1>

        {isSignup && (
          <div className="mb-3">
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3">
          {isSignup ? 'Create account' : 'Login'}
        </button>

        <button
          type="button"
          className="w-full text-sm text-blue-600"
          onClick={() => setIsSignup((v) => !v)}
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  );
}
