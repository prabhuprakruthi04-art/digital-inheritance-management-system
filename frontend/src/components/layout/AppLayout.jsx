import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  const location = useLocation();
  const isNomineeRoute = location.pathname.startsWith("/nominee");

  return (
    <div
      className={`flex min-h-screen font-sans transition-colors duration-300 ${
        isNomineeRoute
          ? "bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Dynamic Navigation Sidebar */}
      <Sidebar />

      {/* Main Canvas & Content View */}
      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        <Navbar isNomineeRoute={isNomineeRoute} />
        <main className={`p-6 md:p-8 flex-1 ${isNomineeRoute ? "bg-slate-950" : "bg-slate-100"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}