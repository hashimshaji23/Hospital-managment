import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { LogIn } from 'lucide-react'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await login(email, password)
            navigate("/dashboard")
        } catch (err) {
            setError(err.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-white px-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full border border-emerald-100">
                <div className="flex flex-col items-center mb-6">
                    <img src={logoImg} alt="MediCare" className="w-20 h-20 object-contain mb-2" />
                    <h1 className="text-2xl font-bold text-emerald-900">Admin Login</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to manage MediCare</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            placeholder="admin@medicare.com"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-rose-600 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-green-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-60"
                    >
                        <LogIn className="w-4 h-4" />
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
