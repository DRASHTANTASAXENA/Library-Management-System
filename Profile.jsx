import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    // Added 'name' to the state
    const [profile, setProfile] = useState({ id: "", email: "", role: "", name: "" });
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return navigate("/login");

        const fetchFullProfile = async () => {
            try {
                // Fetch real data from the backend /profile route we just created
                const res = await axios.get("http://localhost:8000/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (e) {
                console.error("Failed to fetch profile:", e);
                // Fallback to token data if backend fails
                const payload = JSON.parse(atob(token.split(".")[1]));
                setProfile({
                    id: payload.id,
                    email: payload.sub,
                    role: payload.role,
                    name: payload.sub.split('@')[0] // Fallback name
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFullProfile();
    }, [token, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setStatus({ type: "", msg: "" });

        try {
            const res = await axios.post("http://localhost:8000/user/change-password", passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus({ type: "success", msg: res.data.message });
            setPasswords({ old_password: "", new_password: "" });
        } catch (err) {
            setStatus({ type: "error", msg: err.response?.data?.detail || "Update failed" });
        }
    };

    // Logic to use the REAL NAME from the database
    const displayName = profile.name || "User";
    const firstLetter = displayName.charAt(0).toUpperCase();

    // Logic for Dynamic UI based on Role
    const isAdmin = profile.role === "admin";
    const themeGradient = isAdmin
        ? "from-orange-500 to-red-600"
        : "from-blue-600 to-indigo-600";
    const badgeStyle = isAdmin
        ? "bg-orange-100 text-orange-600"
        : "bg-blue-100 text-blue-600";

    if (loading) return <div className="h-screen flex items-center justify-center font-black text-gray-300 animate-pulse">LOADING PROFILE...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 flex items-center justify-center font-sans">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT CARD: DIGITAL IDENTITY */}
                <div className="lg:col-span-5 bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${themeGradient}`}></div>

                    {/* AVATAR BOX: Uses the first letter of the actual name */}
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${themeGradient} flex items-center justify-center text-5xl text-white font-black shadow-lg mb-6 uppercase`}>
                        {firstLetter}
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight text-center">
                        {displayName}
                    </h2>

                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${badgeStyle}`}>
                        {profile.role} Access
                    </span>

                    <div className="w-full mt-10 space-y-4">
                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permanent ID</p>
                            <p className={`text-lg font-mono font-black ${isAdmin ? 'text-orange-600' : 'text-blue-600'}`}>
                                {profile.id}
                            </p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Email</p>
                            <p className="text-sm font-bold text-gray-700">{profile.email}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed w-full text-center">
                        <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em]">
                            Validated Library Member
                        </p>
                    </div>
                </div>

                {/* RIGHT CARD: SECURITY CONTROLS */}
                <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-8">Security Settings</h3>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                                    value={passwords.old_password}
                                    onChange={e => setPasswords({ ...passwords, old_password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">New Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                                    value={passwords.new_password}
                                    onChange={e => setPasswords({ ...passwords, new_password: e.target.value })}
                                />
                            </div>
                        </div>

                        {status.msg && (
                            <div className={`p-4 rounded-2xl text-sm font-bold ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {status.msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${isAdmin ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Update Credentials
                        </button>
                    </form>

                    <div className="mt-10 flex flex-col items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-400 text-sm font-bold hover:text-gray-900 transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}