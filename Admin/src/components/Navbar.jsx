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
    UserCog,
    Stethoscope,
    Shield,
} from 'lucide-react'

const adminNavLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Add Doctor", path: "/add-doctor", icon: UserPlus },
    { name: "List Doctors", path: "/list-doctors", icon: Users },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Service Dashboard", path: "/service-dashboard", icon: LayoutGrid },
    { name: "Add Service", path: "/add-service", icon: PlusSquare },
    { name: "List Services", path: "/list-services", icon: ListChecks },
    { name: "Service Appointments", path: "/service-appointments", icon: CalendarCheck },
]

const doctorNavLinks = [
    { name: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "My Appointments", path: "/doctor/appointments", icon: CalendarCheck },
    { name: "Profile & Schedule", path: "/doctor/profile", icon: UserCog },
]

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, isDoctor, logout } = useAuth()
    const isActive = (path) => location.pathname === path || (path !== "/dashboard" && path !== "/doctor/dashboard" && location.pathname.startsWith(path))

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const navLinks = isDoctor ? doctorNavLinks : adminNavLinks
    const homeRoute = isDoctor ? "/doctor/dashboard" : "/dashboard"

    return (
        <header className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-emerald-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-30">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 shrink-0">
                <Link to={homeRoute} className="flex items-center gap-2">
                    <img src={logoImg} alt="MediCare logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
                    <div className="hidden md:flex flex-col">
                        <span className="font-extrabold text-base text-emerald-950 tracking-tight leading-none">MediCare</span>
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">
                            {isDoctor ? "Doctor Portal" : "Admin Portal"}
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex items-center gap-1 bg-white/95 border border-emerald-100 rounded-full shadow-sm px-2.5 py-1.5 overflow-x-auto max-w-full">
                {navLinks.map((link) => {
                    const Icon = link.icon
                    const active = isActive(link.path)
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                                active
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{link.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile Info & Logout */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {isDoctor && user && (
                    <div className="hidden lg:flex items-center gap-2.5 pl-2 pr-3 py-1 bg-emerald-50/80 border border-emerald-200/80 rounded-full">
                        {user.imageUrl ? (
                            <img src={user.imageUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-emerald-300" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">
                                {user.name ? user.name[0] : "D"}
                            </div>
                        )}
                        <div className="flex flex-col text-left leading-tight">
                            <span className="text-xs font-bold text-emerald-950">Dr. {user.name}</span>
                            <span className="text-[10px] text-emerald-700 font-medium truncate max-w-[110px]">
                                {user.specialization || "Physician"}
                            </span>
                        </div>
                    </div>
                )}

                {!isDoctor && user && (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 border border-emerald-200/80 rounded-full text-xs font-semibold text-emerald-900">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Admin</span>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                    title="Log out"
                >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
                <button
                    onClick={handleLogout}
                    className="sm:hidden p-2 rounded-full text-rose-600 border border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                    title="Log out"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>
    )
}

export default Navbar
