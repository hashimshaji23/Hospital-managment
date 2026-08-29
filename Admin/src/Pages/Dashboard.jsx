import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import StatCard from '../components/StatCard'
import { statusBadgeClass, currency } from '../utils/format'
import {
    CalendarCheck, Users, Wallet, Stethoscope, RefreshCw, ArrowRight,
} from 'lucide-react'

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [patientCount, setPatientCount] = useState(0)
    const [doctorCount, setDoctorCount] = useState(0)
    const [recent, setRecent] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const load = async () => {
        setLoading(true)
        setError("")
        try {
            const [statsRes, patientsRes, doctorsRes, apptRes] = await Promise.all([
                api.get("/appointments/stats/summary"),
                api.get("/appointments/paitents/count"),
                api.get("/doctors?limit=1"),
                api.get("/appointments?limit=6"),
            ])
            setStats(statsRes.stats || {})
            setPatientCount(patientsRes.totalUsers || 0)
            setDoctorCount((doctorsRes.meta && doctorsRes.meta.total) || 0)
            setRecent(apptRes.appointment || [])
        } catch (err) {
            setError(err.message || "Could not load dashboard data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900">Dashboard</h1>
                    <p className="text-sm text-emerald-700/70">Overview of appointments, doctors, and revenue</p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:shadow-sm transition self-start"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={CalendarCheck} label="Total Appointments" value={loading ? "—" : stats?.total ?? 0} accent="emerald" />
                <StatCard icon={Wallet} label="Total Revenue" value={loading ? "—" : currency(stats?.revenue)} accent="amber" />
                <StatCard icon={Users} label="Registered Patients" value={loading ? "—" : patientCount} accent="blue" />
                <StatCard icon={Stethoscope} label="Doctors" value={loading ? "—" : doctorCount} accent="rose" />
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-emerald-900">Recent Appointments</h2>
                    <Link to="/appointments" className="text-sm text-emerald-700 hover:underline inline-flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center text-emerald-600 py-8">Loading...</p>
                ) : recent.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No appointments yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-emerald-100">
                                    <th className="py-2 pr-4">Patient</th>
                                    <th className="py-2 pr-4">Doctor</th>
                                    <th className="py-2 pr-4">Date</th>
                                    <th className="py-2 pr-4">Fee</th>
                                    <th className="py-2 pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((a) => (
                                    <tr key={a._id} className="border-b border-emerald-50">
                                        <td className="py-3 pr-4 font-medium text-gray-900">{a.patientName}</td>
                                        <td className="py-3 pr-4 text-gray-600">{a.doctorName}</td>
                                        <td className="py-3 pr-4 text-gray-600">{a.date} · {a.time}</td>
                                        <td className="py-3 pr-4 text-gray-600">{currency(a.fees)}</td>
                                        <td className="py-3 pr-4"><span className={statusBadgeClass(a.status)}>{a.status}</span></td>
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

export default Dashboard
