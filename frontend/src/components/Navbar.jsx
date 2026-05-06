import React from "react";
import { useNavigate, useLocation } from "react-router";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuthStore();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Vote App", path: "/vote-page" },
    { name: "Batches", path: "/batches" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* glass navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-lg">
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">VoteChain</span>
          </div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-medium transition ${isActive ? "text-white" : "text-slate-500 hover:text-white"}`}
                >
                  {item.name}
                </button>
              );
            })}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-sm font-semibold text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
