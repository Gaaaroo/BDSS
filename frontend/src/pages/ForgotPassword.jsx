import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHome from '../components/BackHome';
import { forgotPassword } from '../services/api/authService';
import LoadingPage from '../components/LoadingPage';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-rose-100">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Forgot Password Form */}
        <div className="flex flex-col justify-center px-10 py-12 md:px-16 bg-white">
          <div className="flex justify-center mb-8">
            <BackHome className="h-24 w-auto" />
          </div>
          <h2 className="text-4xl font-extrabold text-red-700 mb-6 text-center tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          {submitted ? (
            <div className="text-center bg-green-100 text-green-700 py-2 rounded-lg font-medium shadow">
              A reset link has been sent to <br />
              <span className="font-semibold">{email}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition text-black"
                />
                <p className="text-red-500 h-5">{error || ' '}</p>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-red-700 hover:to-rose-700 transition mb-4 cursor-pointer"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="text-left mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-red-600 hover:underline cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Right: Welcome Panel */}
        <div className="hidden md:flex flex-col justify-center items-center rounded-l-[150px] bg-gradient-to-br from-red-600 to-rose-500 text-white px-10 py-12">
          <h3 className="text-3xl font-bold mb-4">Forgot your password?</h3>
          <p className="text-lg text-center mb-4">
            Don’t worry - just enter your email to reset it.
            <br />
            New here? Create an account to get started.
          </p>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="bg-white text-red-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-red-50 transition cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
