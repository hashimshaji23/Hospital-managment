import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { LogIn, Shield, Stethoscope } from 'lucide-react'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [role, setRole] = useState("admin") // "admin" | "doctor"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const loggedInUser = await login(email, password, role)
            if (role === "doctor" || loggedInUser.role === "doctor") {
                navigate("/doctor/dashboard")
            } else {
                navigate("/dashboard")
            }
        } catch (err) {
            setError(err.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50/40 to-white px-4 py-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full border border-emerald-100">
                <div className="flex flex-col items-center mb-6">
                    <img src={logoImg} alt="MediCare" className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2" />
                    <h1 className="text-2xl font-extrabold text-emerald-950">
                        {role === "doctor" ? "Doctor Portal" : "Admin Portal"}
                    </h1>
                    <p className="text-sm text-emerald-700/80 mt-1 text-center">
                        {role === "doctor"
                            ? "Sign in to manage your appointments & schedule"
                            : "Sign in to manage MediCare hospital operations"}
                    </p>
                </div>

                {/* Role Switcher Tabs */}
                <div className="flex items-center p-1 bg-emerald-50 rounded-2xl mb-6 border border-emerald-100">
                    <button
                        type="button"
                        onClick={() => { setRole("admin"); setError(""); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            role === "admin"
                                ? "bg-white text-emerald-900 shadow-sm border border-emerald-200"
                                : "text-emerald-700/70 hover:text-emerald-900"
                        }`}
                    >
                        <Shield className="w-4 h-4 text-emerald-600" />
                        Admin Login
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRole("doctor"); setError(""); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            role === "doctor"
                                ? "bg-white text-emerald-900 shadow-sm border border-emerald-200"
                                : "text-emerald-700/70 hover:text-emerald-900"
                        }`}
                    >
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        Doctor Login
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                            {role === "doctor" ? "Doctor Email" : "Admin Email"}
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                            placeholder={role === "doctor" ? "doctor@medicare.com" : "admin@medicare.com"}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs sm:text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-60 cursor-pointer"
                    >
                        <LogIn className="w-4 h-4" />
                        {loading ? "Signing in..." : `Sign In as ${role === "doctor" ? "Doctor" : "Admin"}`}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
