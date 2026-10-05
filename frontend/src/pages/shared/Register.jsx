import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowRight } from "lucide-react";
import API from "../../services/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("nominee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/register", {
        name: fullName,
        email,
        password,
        role
      });

      const token = res.data?.token;
      let user = res.data?.user || { email, role };

      // Force nominee role if email contains 'nominee' or role selected is nominee
      if (role === "nominee" || email.toLowerCase().includes("nominee")) {
        user = { ...user, role: "nominee" };
      }

      if (token) localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Hard redirect to avoid stale state
      if (user.role === "nominee") {
        window.location.href = "/nominee";
      } else {
        window.location.href = "/owner";
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Offline / fallback mode
      const user = { email, role: email.toLowerCase().includes("nominee") ? "nominee" : role };
      localStorage.setItem("user", JSON.stringify(user));
      
      if (user.role === "nominee") {
        window.location.href = "/nominee";
      } else {
        window.location.href = "/owner";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mx-auto border border-indigo-100">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-xs text-slate-500">Digital Inheritance Management System</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sumithra"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sumithra_nominee@gmail.com"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">I am registering as:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`p-3 border rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs transition ${role === "owner" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"}`}>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={role === "owner"}
                  onChange={() => setRole("owner")}
                  className="hidden"
                />
                Asset Owner
              </label>

              <label className={`p-3 border rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs transition ${role === "nominee" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"}`}>
                <input
                  type="radio"
                  name="role"
                  value="nominee"
                  checked={role === "nominee"}
                  onChange={() => setRole("nominee")}
                  className="hidden"
                />
                Nominee
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Register"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}