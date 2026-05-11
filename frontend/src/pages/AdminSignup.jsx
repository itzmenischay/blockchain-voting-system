import React, { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router";

import { adminSignup } from "../services/adminAuthService";

const AdminSignup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
    secretCode: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await adminSignup(formData);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.role);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 pt-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Signup</h1>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
          />

          <input
            type="text"
            name="profilePic"
            placeholder="Profile Picture URL"
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
          />

          <input
            type="password"
            name="secretCode"
            placeholder="Admin Secret Code"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10"
          />

          <button
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-white text-black font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Already admin?{" "}
          <Link to="/admin/login" className="text-white">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminSignup;
