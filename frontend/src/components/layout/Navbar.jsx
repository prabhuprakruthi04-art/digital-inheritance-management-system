import React from "react";
import { UserCircle, Shield, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

export default function Navbar({ isNomineeRoute }) {
  const { user } = useAuth();

  return (
    <header
      className={`flex items-center justify-between border-b px-6 py-4 transition-colors duration-300 ${
        isNomineeRoute
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <h2
          className={`text-xl font-black tracking-wide ${
            isNomineeRoute ? "text-emerald-400" : "text-indigo-600"
          }`}
        >
          {isNomineeRoute ? "DIMS // Custody Terminal" : "Digital Inheritance Management"}
        </h2>
        {isNomineeRoute && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} /> SSS Verified
          </span>
        )}
      </div>

      <div className="flex items-center gap-5">
        <NotificationBell isNomineeRoute={isNomineeRoute} />

        <div className="flex items-center gap-3">
          <div
            className={`p-1 rounded-full ${
              isNomineeRoute ? "text-emerald-400 bg-slate-800" : "text-indigo-600 bg-indigo-50"
            }`}
          >
            <UserCircle size={28} />
          </div>

          <div className="text-left">
            <h4
              className={`text-sm font-bold leading-tight ${
                isNomineeRoute ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {user?.name || user?.fullName || (isNomineeRoute ? "Trusted Nominee" : "Vault Owner")}
            </h4>

            <p
              className={`text-[11px] font-semibold capitalize tracking-wide ${
                isNomineeRoute ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              {isNomineeRoute ? "Verified Beneficiary" : user?.role || "Estate Owner"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}