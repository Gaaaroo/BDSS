import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackHome from "./BackHome";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../services/api/firebase";

const LoginForm = () => {
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

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    // Authentication logic here
    console.log(form);

    try {
      const response = await fetch("http://localhost:8080/bdss/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //json format
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      console.log("Login successful:", data);
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Hàm xử lý đăng nhập với Google

  const handleLoginWithGG = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // LẤY FIREBASE ID TOKEN
      const idToken = await user.getIdToken();
      console.log("Firebase ID Token:", idToken);

      // Gửi token lên backend
      const res = await fetch(
        "http://localhost:8080/bdss/auth/introspectTokenGoogle",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Login failed at backend.");
      }

      //const data = await res.text();
      localStorage.setItem("accessToken", idToken);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Đăng nhập thất bại.");
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:from-red-700 hover:to-rose-700 transition mb-4"
          >
            Login
          </button>
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={handleRegisterClick}
              className="text-red-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>
            <button className="text-black" onClick={handleLoginWithGG}>
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
            className="bg-white text-red-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-red-50 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
