// src/components/SignupPage.js
import React, { useState } from "react";
import api from "../services/api";

const SignupPage = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager"); // default role
  const [farmId, setFarmId] = useState(""); // ✅ NEW: only used if manager
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ Prepare signup data
      const payload = { name, email, password, role };
      if (role === "manager") {
        if (!farmId) {
          setError("Farm ID is required for managers.");
          setLoading(false);
          return;
        }
        payload.farm_id = farmId;
      }

      const result = await api.signup(payload);

      if (result?.token && result?.user) {
        onSignupSuccess(result.user, result.token);

        // ✅ Clear inputs
        setName("");
        setEmail("");
        setPassword("");
        setRole("manager");
        setFarmId("");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account.");
      setName("");
      setEmail("");
      setPassword("");
      setFarmId("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {role === "manager" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Farm ID (required for Managers)
              </label>
              <input
                type="text"
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                required={role === "manager"}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
