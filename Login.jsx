import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", { email, password, role });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      if (res.data.role === "admin") navigate("/admin/home");
      else navigate("/user/home");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md p-1 px-1">
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/20 animate-fade-in-up">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Welcome <span className="text-blue-600">Back</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              Enter your credentials to access the library
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* ROLE TOGGLE SWITCH */}
            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === "user" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === "admin" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400"
                }`}
              >
                Librarian
              </button>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">Secure Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold text-center border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-5 rounded-2xl font-black text-white uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${
                role === "admin" 
                  ? "bg-orange-600 hover:bg-orange-700 shadow-orange-500/20" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              }`}
            >
              Authorize Access
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-500">
              New to the system?{" "}
              <button 
                onClick={() => navigate("/signup")} 
                className="text-blue-600 font-black hover:underline underline-offset-4 transition-all"
              >
                Create Account
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}