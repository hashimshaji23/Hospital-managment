import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

const ProtectedRoute = ({ role }) => {
    const { isAuthenticated, loading, isDoctor, isAdmin } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50/40">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Role-based protection:
    // If route requires "admin" but user is doctor, redirect to doctor dashboard
    if (role === "admin" && !isAdmin) {
        return <Navigate to="/doctor/dashboard" replace />
    }

    // If route requires "doctor" and user is neither doctor nor admin, redirect to login
    if (role === "doctor" && !isDoctor && !isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50/50 via-teal-50/20 to-white text-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    )
}

export default ProtectedRoute
