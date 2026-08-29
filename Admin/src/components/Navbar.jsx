import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard,
    UserPlus,
    Users,
    Calendar,
    LayoutGrid,
    PlusSquare,
    ListChecks,
    CalendarCheck,
    LogOut,
} from 'lucide-react'

const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Add Doctor", path: "/add-doctor", icon: UserPlus },
    { name: "List Doctors", path: "/list-doctors", icon: Users },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Service Dashboard", path: "/service-dashboard", icon: LayoutGrid },
    { name: "Add Service", path: "/add-service", icon: PlusSquare },
    { name: "List Services", path: "/list-services", icon: ListChecks },
    { name: "Service Appointments", path: "/service-appointments", icon: CalendarCheck },
]

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const isActive = (path) => location.pathname.startsWith(path)

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <header className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center shrink-0">
                <img src={logoImg} alt="Medi-Appoint logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" />
            </Link>

            {/* Floating pill nav */}
            <nav className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-emerald-100 rounded-full shadow-lg px-3 py-2 overflow-x-auto max-w-full">
                {navLinks.map((link) => {
                    const Icon = link.icon
                    const active = isActive(link.path)
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${active
                                ? "bg-emerald-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{link.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition shrink-0"
            >
                <LogOut className="w-4 h-4" /> Logout
            </button>
            <button
                onClick={handleLogout}
                className="sm:hidden p-2.5 rounded-full text-rose-600 border border-rose-200 hover:bg-rose-50 transition shrink-0"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </header>
    )
}

export default Navbar
