import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup() {
    if (!username || !email || !password) {
      alert("Fill all fields");
      return;
    }

    // ✅ SAME LOGIC (unchanged)
    localStorage.setItem(
      "user",
      JSON.stringify({ username, email, password })
    );

    alert("Signup successful! Please login.");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
            ✨
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-1">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign up to start tracking your attendance
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              placeholder="Enter your username"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
