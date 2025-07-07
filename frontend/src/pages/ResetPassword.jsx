import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackHome from '../components/BackHome';
import { resetPassword } from '../services/api/authService';
import { resetPasswordSchema } from '../Validations/userValidation';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  //Lấy token từ URL
  useEffect(() => {
    const tokenFromURL = searchParams.get('token');
    if (tokenFromURL) {
      // console.log('token ne:', tokenFromURL);
      setToken(tokenFromURL);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFormError({});
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await resetPasswordSchema.validate(form, { abortEarly: false });
      await resetPassword(token, form.newPassword);
      setSubmitted(true);
    } catch (err) {
      const errors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormError(errors);
      } else {
        setApiError(err.message || 'Reset failed. Please try again.');
      }
    }
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
            <div className="text-center bg-green-100 text-green-700 py-2 rounded-lg font-medium shadow">
              Your password has been reset successfully!
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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
