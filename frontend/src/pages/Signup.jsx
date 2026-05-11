import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";
import { useNavigate, Link } from "react-router";
import { signupUser } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Lock, Image, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [toastConfig, setToastConfig] = useState(null);
  const showToast = (message, type = "info") => {
    setToastConfig({ message, type });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await signupUser(formData);

      login({
        token: res.data.token,
        user: res.data.user,
        role: "user",
      });

      showToast("Account created!", "success");
      setTimeout(() => {
        navigate("/elections");
      }, 1200);
    } catch (error) {
      showToast(error.response?.data?.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 pt-0">
      {/* Toast */}
      <AnimatePresence>
        {toastConfig && (
          <Toast
            message={toastConfig.message}
            type={toastConfig.type}
            onClose={() => setToastConfig(null)}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop:blur-xl border border-white/10 rounded-3xl p-8"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Create Account
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Secure decentralized voting starts here
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 outline-none text-white"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 outline-none text-white"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 outline-none text-white"
            />
          </div>

          <div className="relative">
            <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="profilePic"
              placeholder="Profile Picture URL"
              value={formData.profilePic}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 outline-none text-white"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign up"}
          </motion.button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Aleary have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
