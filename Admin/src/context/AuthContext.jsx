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

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password }, { skipAuth: true })
        if (res.user && res.user.role !== "admin") {
            throw new Error("This account does not have admin access.")
        }
        localStorage.setItem("adminToken", res.token)
        localStorage.setItem("adminUser", JSON.stringify(res.user))
        setUser(res.user)
        return res.user
    }

    const logout = () => {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminUser")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
