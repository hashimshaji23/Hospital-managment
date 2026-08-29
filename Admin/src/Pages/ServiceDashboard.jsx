import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { currency } from '../utils/format'
import { ListChecks, RefreshCw } from 'lucide-react'

const ServiceDashboard = () => {
    const [services, setServices] = useState([])
    const [totals, setTotals] = useState({ total: 0, completed: 0, canceled: 0, earning: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const load = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await api.get("/service-appointments/stats/summary")
            const list = res.services || []
            setServices(list)
            setTotals({
                total: list.reduce((s, x) => s + (x.totalAppointments || 0), 0),
                completed: list.reduce((s, x) => s + (x.completed || 0), 0),
                canceled: list.reduce((s, x) => s + (x.canceled || 0), 0),
                earning: list.reduce((s, x) => s + (x.earning || 0), 0),
            })
        } catch (err) {
            setError(err.message || "Could not load service stats")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-emerald-900">Service Dashboard</h1>
                <button onClick={load} className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:shadow-sm transition self-start">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {error && <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SummaryCard label="Total Bookings" value={totals.total} />
                <SummaryCard label="Completed" value={totals.completed} />
                <SummaryCard label="Canceled" value={totals.canceled} />
                <SummaryCard label="Total Earnings" value={currency(totals.earning)} />
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {loading ? (
                    <p className="text-center text-emerald-600 py-10">Loading...</p>
                ) : services.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No services yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-emerald-100 bg-emerald-50/50">
                                    <th className="py-3 px-4">Service</th>
                                    <th className="py-3 px-4">Price</th>
                                    <th className="py-3 px-4">Bookings</th>
                                    <th className="py-3 px-4">Completed</th>
                                    <th className="py-3 px-4">Canceled</th>
                                    <th className="py-3 px-4">Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((s) => (
                                    <tr key={s._id} className="border-b border-emerald-50 hover:bg-emerald-50/30">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {s.image ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" /> : <ListChecks className="w-4 h-4 text-emerald-300" />}
                                                </div>
                                                <p className="font-semibold text-gray-900">{s.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{currency(s.price)}</td>
                                        <td className="py-3 px-4 text-gray-600">{s.totalAppointments}</td>
                                        <td className="py-3 px-4 text-gray-600">{s.completed}</td>
                                        <td className="py-3 px-4 text-gray-600">{s.canceled}</td>
                                        <td className="py-3 px-4 text-gray-600">{currency(s.earning)}</td>
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

const SummaryCard = ({ label, value }) => (
    <div className="rounded-2xl p-4 bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-sm">
        <p className="text-sm font-medium text-emerald-800/80">{label}</p>
        <p className="mt-2 text-2xl font-extrabold text-emerald-900 tracking-tight">{value}</p>
    </div>
)

export default ServiceDashboard
