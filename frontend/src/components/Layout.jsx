import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import { useVoteStore } from "../store/useVoteStore";

const Layout = () => {
  const hydrate = useVoteStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full bottom-[-200px] right-[-200px]" />
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="relative z-10 pt-24">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
