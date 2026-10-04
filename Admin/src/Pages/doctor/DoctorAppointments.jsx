import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'
import { statusBadgeClass, currency, formatDoctorTimeString } from '../../utils/format'
import {
    Search,
    X,
    Calendar,
    Clock,
    Phone,
    User,
    Check,
    XCircle,
    FileText,
    CalendarClock,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
} from 'lucide-react'

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Canceled"]

const DoctorAppointments = () => {
    const { user } = useAuth()
    const doctorId = user?._id || user?.id

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [updatingId, setUpdatingId] = useState(null)

    // Reschedule state
    const [reschedulingId, setReschedulingId] = useState(null)
    const [rescheduleDate, setRescheduleDate] = useState("")
    const [rescheduleTime, setRescheduleTime] = useState("")

    // Notes state
    const [notesDraft, setNotesDraft] = useState({})
    const [savingNoteId, setSavingNoteId] = useState(null)
    const [expandedNoteId, setExpandedNoteId] = useState(null)

    const loadAppointments = async (q = search, status = statusFilter) => {
        if (!doctorId) return
        setLoading(true)
        setError("")
        try {
            const params = new URLSearchParams()
            if (q) params.set("search", q)
            if (status) params.set("status", status)
            params.set("limit", "150")

            const res = await api.get(`/appointments/doctor/${doctorId}?${params.toString()}`)
            const items = res?.appointment || []
            setAppointments(items)

            setNotesDraft((prev) => {
                const next = { ...prev }
                items.forEach((a) => {
                    if (next[a._id] === undefined) {
                        next[a._id] = a.notes || ""
                    }
                })
                return next
            })
        } catch (err) {
            setError(err.message || "Failed to load appointments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAppointments(search, statusFilter)
        }, 300)
        return () => clearTimeout(timer)
    }, [search, statusFilter, doctorId])

    const handleUpdateStatus = async (id, status) => {
        setUpdatingId(id)
        try {
            await api.put(`/appointments/${id}`, { status })
            await loadAppointments(search, statusFilter)
        } catch (err) {
            setError(err.message || "Could not update status")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleSaveReschedule = async (id) => {
        const time = formatDoctorTimeString(rescheduleTime)
        if (!rescheduleDate || !time) {
            setError("Please pick both a valid date and time slot.")
            return
        }
        setUpdatingId(id)
        try {
            await api.put(`/appointments/${id}`, { date: rescheduleDate, time })
            setReschedulingId(null)
            setRescheduleDate("")
            setRescheduleTime("")
            await loadAppointments(search, statusFilter)
        } catch (err) {
            setError(err.message || "Could not reschedule appointment")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleSaveNotes = async (id) => {
        setSavingNoteId(id)
        try {
            await api.put(`/appointments/${id}`, { notes: notesDraft[id] || "" })
            await loadAppointments(search, statusFilter)
            setExpandedNoteId(null)
        } catch (err) {
            setError(err.message || "Could not save notes")
        } finally {
            setSavingNoteId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-emerald-950">My Patient Bookings</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage your appointments, update consult statuses, and document clinical visit notes.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search patient, mobile..."
                            className="w-full pl-9 pr-8 py-2 rounded-full border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-full border border-emerald-200 text-sm bg-white font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        <option value="Rescheduled">Rescheduled</option>
                    </select>

                    <button
                        onClick={() => loadAppointments(search, statusFilter)}
                        className="p-2 rounded-full border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        title="Reload"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Appointments Card List / Table */}
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-emerald-600">
                        <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm font-medium">Fetching appointment records...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">No appointments found</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                            {search || statusFilter
                                ? "No bookings match your current search or status filter criteria."
                                : "You have no appointments scheduled at this moment."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-emerald-100 bg-emerald-50/40">
                                    <th className="py-3.5 px-4">Patient Info</th>
                                    <th className="py-3.5 px-4">Slot Details</th>
                                    <th className="py-3.5 px-4">Fee & Payment</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Visit Notes</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {appointments.map((appt) => {
                                    const isLocked = appt.status === "Completed" || appt.status === "Canceled"
                                    const isRescheduling = reschedulingId === appt._id
                                    const isNotesOpen = expandedNoteId === appt._id

                                    return (
                                        <React.Fragment key={appt._id}>
                                            <tr className="hover:bg-emerald-50/30 transition">
                                                {/* Patient */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                                            {appt.patientName ? appt.patientName[0] : "P"}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight">
                                                                {appt.patientName}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {appt.age ? `${appt.age} yrs` : ""} {appt.gender ? `· ${appt.gender}` : ""}
                                                            </p>
                                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                                <Phone className="w-3 h-3 text-gray-400" />
                                                                {appt.mobile}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Slot */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                            {appt.date}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                            {appt.time}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Fee & Payment */}
                                                <td className="py-4 px-4 align-top">
                                                    <div>
                                                        <span className="font-bold text-gray-900">{currency(appt.fees)}</span>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                                {appt.payment?.method || "Cash"}
                                                            </span>
                                                            <span
                                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                                    appt.payment?.status === "Paid"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-amber-100 text-amber-700"
                                                                }`}
                                                            >
                                                                {appt.payment?.status || "Pending"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status Dropdown */}
                                                <td className="py-4 px-4 align-top">
                                                    <select
                                                        value={STATUS_OPTIONS.includes(appt.status) ? appt.status : "Pending"}
                                                        disabled={isLocked || updatingId === appt._id}
                                                        onChange={(e) => handleUpdateStatus(appt._id, e.target.value)}
                                                        className={`${statusBadgeClass(appt.status)} bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-80`}
                                                    >
                                                        {appt.status === "Rescheduled" && (
                                                            <option value="Rescheduled">Rescheduled</option>
                                                        )}
                                                        {STATUS_OPTIONS.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>

                                                {/* Clinical Notes button */}
                                                <td className="py-4 px-4 align-top">
                                                    <button
                                                        onClick={() => setExpandedNoteId(isNotesOpen ? null : appt._id)}
                                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                                                            appt.notes
                                                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                                                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        {appt.notes ? "View Note" : "+ Add Note"}
                                                    </button>
                                                </td>

                                                {/* Actions: Complete, Cancel, Reschedule */}
                                                <td className="py-4 px-4 align-top text-right">
                                                    {!isLocked ? (
                                                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                            <button
                                                                onClick={() => handleUpdateStatus(appt._id, "Completed")}
                                                                disabled={updatingId === appt._id}
                                                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer"
                                                                title="Mark as Completed"
                                                            >
                                                                <Check className="w-3.5 h-3.5" /> Done
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setReschedulingId(isRescheduling ? null : appt._id)
                                                                    setRescheduleDate(appt.date || "")
                                                                    setRescheduleTime(appt.time || "")
                                                                }}
                                                                disabled={updatingId === appt._id}
                                                                className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                                                                title="Reschedule"
                                                            >
                                                                <CalendarClock className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleUpdateStatus(appt._id, "Canceled")}
                                                                disabled={updatingId === appt._id}
                                                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                                                title="Cancel Appointment"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-medium">Finalized</span>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Expandable Reschedule Row */}
                                            {isRescheduling && (
                                                <tr className="bg-emerald-50/60 border-b border-emerald-100">
                                                    <td colSpan={6} className="p-4">
                                                        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                                                                <CalendarClock className="w-4 h-4 text-emerald-600" />
                                                                Reschedule Patient:
                                                            </div>
                                                            <input
                                                                type="date"
                                                                value={rescheduleDate}
                                                                onChange={(e) => setRescheduleDate(e.target.value)}
                                                                className="px-3 py-1.5 rounded-xl border border-emerald-200 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                            />
                                                            <input
                                                                type="time"
                                                                value={rescheduleTime}
                                                                onChange={(e) => setRescheduleTime(e.target.value)}
                                                                className="px-3 py-1.5 rounded-xl border border-emerald-200 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                            />
                                                            <div className="flex items-center gap-2 ml-auto">
                                                                <button
                                                                    onClick={() => handleSaveReschedule(appt._id)}
                                                                    disabled={updatingId === appt._id}
                                                                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
                                                                >
                                                                    Confirm Reschedule
                                                                </button>
                                                                <button
                                                                    onClick={() => setReschedulingId(null)}
                                                                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {/* Expandable Clinical Notes Row */}
                                            {isNotesOpen && (
                                                <tr className="bg-emerald-50/40 border-b border-emerald-100">
                                                    <td colSpan={6} className="p-4">
                                                        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                                                                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                                                    Clinical Consultation Notes for {appt.patientName}
                                                                </label>
                                                                <button
                                                                    onClick={() => setExpandedNoteId(null)}
                                                                    className="text-gray-400 hover:text-gray-600 text-xs font-medium cursor-pointer"
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                rows={3}
                                                                value={notesDraft[appt._id] ?? ""}
                                                                onChange={(e) => setNotesDraft({ ...notesDraft, [appt._id]: e.target.value })}
                                                                placeholder="Enter consultation summary, prescriptions, symptoms, or follow-up instructions..."
                                                                className="w-full rounded-xl border border-emerald-200 p-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                            />
                                                            <div className="flex justify-end">
                                                                <button
                                                                    onClick={() => handleSaveNotes(appt._id)}
                                                                    disabled={savingNoteId === appt._id}
                                                                    className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
                                                                >
                                                                    {savingNoteId === appt._id ? "Saving Note..." : "Save Note"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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

export default DoctorAppointments
