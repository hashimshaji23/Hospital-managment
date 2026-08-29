import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { statusBadgeClass, currency } from '../utils/format'
import { Search, XCircle } from 'lucide-react'

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Canceled", "Rescheduled"]

const Appointments = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [query, setQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [updatingId, setUpdatingId] = useState(null)

    const load = async () => {
        setLoading(true)
        setError("")
        try {
            const params = new URLSearchParams()
            if (query) params.set("search", query)
            if (statusFilter) params.set("status", statusFilter)
            const res = await api.get(`/appointments${params.toString() ? `?${params}` : ""}`)
            setAppointments(res.appointment || [])
        } catch (err) {
            setError(err.message || "Could not load appointments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [statusFilter])
    useEffect(() => {
        const t = setTimeout(load, 350)
        return () => clearTimeout(t)
    }, [query])

    const updateStatus = async (id, status) => {
        setUpdatingId(id)
        try {
            await api.put(`/appointments/${id}`, { status })
            load()
        } catch (err) {
            setError(err.message || "Could not update status")
        } finally {
            setUpdatingId(null)
        }
    }

    const cancelAppointment = async (id) => {
        setUpdatingId(id)
        try {
            await api.post(`/appointments/${id}/cancel`, {})
            load()
        } catch (err) {
            setError(err.message || "Could not cancel appointment")
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-emerald-900">Doctor Appointments</h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search patient, mobile..."
                            className="w-full pl-9 pr-3 py-2 rounded-full border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-full border border-emerald-200 text-sm"
                    >
                        <option value="">All Status</option>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {loading ? (
                    <p className="text-center text-emerald-600 py-10">Loading...</p>
                ) : appointments.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No appointments found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-emerald-100 bg-emerald-50/50">
                                    <th className="py-3 px-4">Patient</th>
                                    <th className="py-3 px-4">Doctor</th>
                                    <th className="py-3 px-4">Date / Time</th>
                                    <th className="py-3 px-4">Fee</th>
                                    <th className="py-3 px-4">Payment</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((a) => (
                                    <tr key={a._id} className="border-b border-emerald-50 hover:bg-emerald-50/30">
                                        <td className="py-3 px-4">
                                            <p className="font-semibold text-gray-900">{a.patientName}</p>
                                            <p className="text-xs text-gray-500">{a.mobile}</p>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            <p>{a.doctorName}</p>
                                            <p className="text-xs text-gray-400">{a.speciality}</p>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{a.date} · {a.time}</td>
                                        <td className="py-3 px-4 text-gray-600">{currency(a.fees)}</td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {a.payment?.method} · {a.payment?.status}
                                        </td>
                                        <td className="py-3 px-4">
                                            <select
                                                value={a.status}
                                                disabled={updatingId === a._id || a.status === "Completed" || a.status === "Canceled"}
                                                onChange={(e) => updateStatus(a._id, e.target.value)}
                                                className={`${statusBadgeClass(a.status)} bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70`}
                                            >
                                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {a.status !== "Canceled" && a.status !== "Completed" && (
                                                <button
                                                    onClick={() => cancelAppointment(a._id)}
                                                    disabled={updatingId === a._id}
                                                    className="p-2 rounded-full hover:bg-rose-50 text-rose-500 disabled:opacity-50"
                                                    title="Cancel"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Appointments
