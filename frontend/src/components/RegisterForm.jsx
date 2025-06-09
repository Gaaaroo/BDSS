import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackHome from "./BackHome";
import { registerUser } from "../services/api/authService";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    phone: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.username || !form.phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { confirmPassword, ...dataToSend } = form;
    console.log("Data being sent:", dataToSend);

    try {
      const result = await registerUser(dataToSend);
      navigate("/verify-otp");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      console.error("Error details:", err.response?.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-rose-100">
      <div className="flex bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl h-[800px]">
        {/* Left: Welcome Panel */}
        <div className="hidden md:flex flex-col justify-center items-center rounded-r-[150px] bg-gradient-to-br from-red-600 to-rose-500 w-1/2 p-10">
          <h3 className="text-3xl font-bold text-white mt-6">
            Welcome to BDSS!
          </h3>
          <p className="text-red-100 mt-2 text-center">
            Join us and experience the best service.
          </p>
        </div>
        {/* Right: Form */}
        <div className="w-full md:w-1/2 p-10">
          <div className="flex flex-col items-center mb-8">
            <BackHome className="h-16 w-auto mb-2" />

            <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">Sign up to get started!</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="mb-2 text-red-600 text-center text-sm font-medium bg-red-50 rounded px-2 py-1">
                {error}
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.passwordConfirmed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 transition shadow-lg"
            >
              Register
            </button>
          </form>
          <div className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <span
              className="text-red-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
