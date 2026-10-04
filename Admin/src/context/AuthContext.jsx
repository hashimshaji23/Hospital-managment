import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("adminToken")
        const storedUser = localStorage.getItem("adminUser")
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                localStorage.removeItem("adminUser")
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password, role = "admin") => {
        if (role === "doctor") {
            const res = await api.post("/doctors/login", { email: email.trim(), password }, { skipAuth: true })
            const docData = res.data || {}
            const doctorUser = {
                ...docData,
                role: "doctor",
                _id: docData._id || docData.id,
                id: docData._id || docData.id,
            }
            localStorage.setItem("adminToken", res.token)
            localStorage.setItem("adminUser", JSON.stringify(doctorUser))
            setUser(doctorUser)
            return doctorUser
        } else {
            const res = await api.post("/auth/login", { email: email.trim(), password }, { skipAuth: true })
            if (res.user && res.user.role !== "admin") {
                throw new Error("This account does not have admin access.")
            }
            localStorage.setItem("adminToken", res.token)
            localStorage.setItem("adminUser", JSON.stringify(res.user))
            setUser(res.user)
            return res.user
        }
    }

    const updateUser = (updated) => {
        setUser((prev) => {
            const next = { ...prev, ...updated }
            localStorage.setItem("adminUser", JSON.stringify(next))
            return next
        })
    }

    const logout = () => {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminUser")
        setUser(null)
    }

    const isAdmin = user?.role === "admin"
    const isDoctor = user?.role === "doctor"

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateUser,
            isAuthenticated: !!user,
            isAdmin,
            isDoctor,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
