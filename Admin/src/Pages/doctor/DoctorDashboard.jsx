import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'
import StatCard from '../../components/StatCard'
import { statusBadgeClass, currency } from '../../utils/format'
import {
    CalendarCheck,
    CheckCircle2,
    Clock3,
    Wallet,
    RefreshCw,
    ArrowRight,
    Phone,
    User,
    Check,
    X,
    Calendar,
    Award,
    Star,
    Sparkles,
    AlertCircle,
} from 'lucide-react'

const todayKey = () => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

const DoctorDashboard = () => {
    const { user, updateUser } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionLoading, setActionLoading] = useState(null)
    const [togglingAvail, setTogglingAvail] = useState(false)

    const doctorId = user?._id || user?.id

    const loadData = async () => {
        if (!doctorId) return
        setLoading(true)
        setError("")
        try {
            const [apptRes, statsRes, docRes] = await Promise.all([
                api.get(`/appointments/doctor/${doctorId}?limit=100`),
                api.get(`/appointments/doctor/${doctorId}/stats`).catch(() => null),
                api.get(`/doctors/${doctorId}`).catch(() => null),
            ])

            const list = apptRes?.appointment || []
            setAppointments(list)

            if (statsRes?.stats) {
                setStats(statsRes.stats)
            }

            if (docRes?.data) {
                updateUser(docRes.data)
            }
        } catch (err) {
            setError(err.message || "Could not load dashboard data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [doctorId])

    const handleToggleAvailability = async () => {
        if (!doctorId || togglingAvail) return
        setTogglingAvail(true)
        try {
            const res = await api.post(`/doctors/${doctorId}/toggle-availability`, {})
            if (res.data) {
                updateUser(res.data)
            }
        } catch (err) {
            setError(err.message || "Failed to toggle availability")
        } finally {
            setTogglingAvail(false)
        }
    }

    const handleStatusChange = async (appointmentId, newStatus) => {
        setActionLoading(appointmentId)
        try {
            await api.put(`/appointments/${appointmentId}`, { status: newStatus })
            await loadData()
        } catch (err) {
            setError(err.message || "Could not update appointment")
        } finally {
            setActionLoading(null)
        }
    }

    // Fallback calculations if backend stats endpoint failed
    const totalCount = stats?.total ?? appointments.length
    const completedCount = stats?.completed ?? appointments.filter((a) => a.status === "Completed").length
    const pendingCount = stats?.pending ?? appointments.filter((a) => a.status === "Pending" || a.status === "Confirmed").length
    const totalEarnings = stats?.earnings ?? appointments
        .filter((a) => a.status === "Completed" || a.status === "Confirmed")
        .reduce((sum, a) => sum + (Number(a.fees) || 0), 0)

    const todayDate = todayKey()
    const todayAppointments = appointments.filter((a) => a.date === todayDate)
    const recentAppointments = [...appointments]
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
        .slice(0, 6)

    const isAvailable = (user?.availability || "Available").toLowerCase() === "available"

    return (
        <div className="space-y-6">
            {/* Header & Doctor Info Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-emerald-100/50 via-teal-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="relative">
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={user.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-200 shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                                    {user?.name ? user.name[0] : "D"}
                                </div>
                            )}
                            <span
                                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                                    isAvailable ? "bg-emerald-500" : "bg-gray-400"
                                }`}
                                title={isAvailable ? "Available" : "Unavailable"}
                            >
                                <span className="w-2 h-2 rounded-full bg-white" />
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                                    Welcome back, Dr. {user?.name || "Doctor"}!
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                    {user?.specialization || "General Medicine"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                                {user?.experience && (
                                    <span className="flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                                        {user.experience} exp
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    {user?.rating ? `${user.rating} rating` : "New Doctor"}
                                </span>
                                <span className="text-emerald-700 font-semibold">
                                    Fee: {currency(user?.fee || 0)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Actions: Quick Availability Toggle & Refresh */}
                    <div className="flex items-center gap-3 self-start lg:self-center flex-wrap">
                        <button
                            onClick={handleToggleAvailability}
                            disabled={togglingAvail}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                                isAvailable
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                                    : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                    isAvailable ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                                }`}
                            />
                            {togglingAvail
                                ? "Updating..."
                                : isAvailable
                                ? "Status: Available"
                                : "Status: Unavailable"}
                        </button>

                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 shadow-sm transition cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Metrics Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={CalendarCheck}
                    label="Total Appointments"
                    value={loading ? "—" : totalCount}
                    accent="emerald"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Completed Visits"
                    value={loading ? "—" : completedCount}
                    accent="teal"
                />
                <StatCard
                    icon={Clock3}
                    label="Pending / Upcoming"
                    value={loading ? "—" : pendingCount}
                    accent="amber"
                />
                <StatCard
                    icon={Wallet}
                    label="Total Earnings"
                    value={loading ? "—" : currency(totalEarnings)}
                    accent="blue"
                />
            </div>

            {/* Today's Schedule Card */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-base sm:text-lg font-bold text-emerald-950">
                            Today's Appointments ({todayAppointments.length})
                        </h2>
                    </div>
                    <Link
                        to="/doctor/appointments"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                    >
                        View all appointments <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center py-6 text-sm text-emerald-600">Loading today's schedule...</p>
                ) : todayAppointments.length === 0 ? (
                    <div className="text-center py-8 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200">
                        <p className="text-sm font-medium text-emerald-900">No appointments scheduled for today.</p>
                        <p className="text-xs text-gray-500 mt-1">Enjoy your free time or review upcoming patient bookings.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todayAppointments.map((appt) => {
                            const isLocked = appt.status === "Completed" || appt.status === "Canceled"
                            return (
                                <div
                                    key={appt._id}
                                    className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/50 transition flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="font-bold text-sm text-gray-900 truncate">
                                                {appt.patientName}
                                            </span>
                                            <span className={statusBadgeClass(appt.status)}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 flex items-center gap-1.5 mb-1">
                                            <Clock3 className="w-3.5 h-3.5 text-emerald-600" />
                                            {appt.time} · {currency(appt.fees)}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                            {appt.mobile}
                                        </p>
                                    </div>

                                    {!isLocked && (
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-100/70">
                                            <button
                                                onClick={() => handleStatusChange(appt._id, "Completed")}
                                                disabled={actionLoading === appt._id}
                                                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Complete
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(appt._id, "Canceled")}
                                                disabled={actionLoading === appt._id}
                                                className="py-1.5 px-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition cursor-pointer"
                                                title="Cancel appointment"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Recent Appointments Table */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-emerald-950">Recent Patient Appointments</h2>
                    <Link
                        to="/doctor/appointments"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                    >
                        Manage All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center py-8 text-sm text-emerald-600">Loading appointments...</p>
                ) : recentAppointments.length === 0 ? (
                    <p className="text-center py-8 text-sm text-gray-500">No appointments recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-emerald-100 bg-emerald-50/40">
                                    <th className="py-3 px-4">Patient</th>
                                    <th className="py-3 px-4">Date & Time</th>
                                    <th className="py-3 px-4">Fee / Payment</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Quick Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {recentAppointments.map((appt) => {
                                    const isLocked = appt.status === "Completed" || appt.status === "Canceled"
                                    return (
                                        <tr key={appt._id} className="hover:bg-emerald-50/30 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                                        {appt.patientName ? appt.patientName[0] : "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{appt.patientName}</p>
                                                        <p className="text-xs text-gray-400">{appt.mobile}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-700 font-medium">
                                                {appt.date} <span className="text-xs text-gray-400">· {appt.time}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-700">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold">{currency(appt.fees)}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600 font-medium">
                                                        {appt.payment?.method || "Cash"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={statusBadgeClass(appt.status)}>
                                                    {appt.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {!isLocked ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleStatusChange(appt._id, "Completed")}
                                                            disabled={actionLoading === appt._id}
                                                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                                                            title="Mark as Completed"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(appt._id, "Canceled")}
                                                            disabled={actionLoading === appt._id}
                                                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                                                            title="Cancel Appointment"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium">Finalized</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorDashboard
