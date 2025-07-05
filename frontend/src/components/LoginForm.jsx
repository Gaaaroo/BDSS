import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHome from './BackHome';
import { login, loginWithTokenGoogle } from '../services/api/authService';
import { useApp } from '../Contexts/AppContext';
import { loginSchema } from '../Validations/userValidation';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsLogged, getUserRoleAndNavigate } = useApp();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  //General error for the whole form
  const [error, setError] = useState('');
  //Specific input validation errors
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setFormError({});
  };

  //Handle login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate(form, { abortEarly: false });
      setFormError({});
      await login(form);
      setIsLogged(true);
      await getUserRoleAndNavigate();
      setError('');
    } catch (error) {
      const errors = {};
      if (error.inner) {
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormError(errors);
      } else {
        setError('Invalid username or password.');
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginWithGG = async () => {
    try {
      await loginWithTokenGoogle();
      setIsLogged(true);
      await getUserRoleAndNavigate();
    } catch (error) {
      setError('Google authentication failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-rose-100">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Login Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center px-10 py-12 md:px-16 bg-white"
        >
          <div className="flex justify-center mb-2">
            <BackHome className="h-24 w-auto" />
          </div>
          <h2 className="text-4xl font-extrabold text-red-700 mb-8 text-center tracking-tight">
            Welcome Back
          </h2>
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-100 rounded py-2 px-4">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 font-semibold">
              Username
            </label>
            <input
              autoComplete="true"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition text-black"
            />
            <p className="text-red-500 h-5">{formError.username || ' '}</p>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-semibold">
              Password
            </label>
            <input
              autoComplete="true"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition text-black"
            />
            <p className="text-red-500 h-5 ">{formError.password || ' '}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-red-700 hover:to-rose-700 transition mb-4 cursor-pointer"
          >
            Login
          </button>
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={handleRegisterClick}
              className="text-red-600 hover:underline text-sm cursor-pointer"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={handleLoginWithGG}
              className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              <img
                src="https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_960_720.png"
                alt=""
                className="w-4 h-4"
              />
              Login with Google
            </button>
          </div>
        </form>
        {/* Right: Welcome Panel */}
        <div className="hidden md:flex flex-col justify-center items-center rounded-l-[150px] bg-gradient-to-br from-red-600 to-rose-500 text-white px-10 py-12">
          <h3 className="text-3xl font-bold mb-4">Welcome to login</h3>
          <p className="text-lg text-center mb-8">
            Don't have an account yet? Join us today and explore the world of
            data science with our platform.
          </p>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="bg-white text-red-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-red-50 transition cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
