import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHome from '../components/BackHome';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFormError({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!form.newPassword.trim()) {
      errors.newPassword = 'Please enter a new password';
    } else if (form.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    setSubmitted(true);
    console.log('New password set successfully!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-rose-100">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Reset Password Form */}
        <div className="flex flex-col justify-center px-10 py-12 md:px-16 bg-white">
          <div className="flex justify-center mb-8">
            <BackHome className="h-24 w-auto" />
          </div>
          <h2 className="text-4xl font-extrabold text-red-700 mb-6 text-center tracking-tight">
            Set New Password
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter your new password below.
          </p>

          {submitted ? (
            <div className="text-center bg-green-100 text-green-700 p-4 rounded-lg font-medium shadow">
              Your password has been reset successfully!
              <br />
              <button
                onClick={() => navigate('/login')}
                className="mt-4 underline text-sm text-red-600 hover:text-red-700"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition text-black"
                />
                <p className="text-red-500 h-5">
                  {formError.newPassword || ' '}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition text-black"
                />
                <p className="text-red-500 h-5">
                  {formError.confirmPassword || ' '}
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-red-700 hover:to-rose-700 transition mb-4 cursor-pointer"
              >
                Confirm Reset
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

        {/* Right: Support Panel */}
        <div className="hidden md:flex flex-col justify-center items-center rounded-l-[150px] bg-gradient-to-br from-red-600 to-rose-500 text-white px-10 py-12">
          <h3 className="text-3xl font-bold mb-4">Reset your password</h3>
          <p className="text-lg text-center mb-4">
            You’re just one step away from securing your account.
            <br />
            Don’t have an account yet? Register now!
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
