import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ConfirmModal from '../components/ConfirmModal'
import { currency } from '../utils/format'
import { Search, Pencil, Trash2, ToggleLeft, ToggleRight, Users } from 'lucide-react'

const ListDoctors = () => {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [query, setQuery] = useState("")
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const load = async (q = "") => {
        setLoading(true)
        setError("")
        try {
            const res = await api.get(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`)
            setDoctors(res.data || res.doctors || [])
        } catch (err) {
            setError(err.message || "Could not load doctors")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])
    useEffect(() => {
        const t = setTimeout(() => load(query), 350)
        return () => clearTimeout(t)
    }, [query])

    const toggleAvailability = async (id) => {
        try {
            await api.post(`/doctors/${id}/toggle-availability`, {})
            load(query)
        } catch (err) {
            setError(err.message || "Could not toggle availability")
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await api.del(`/doctors/${deleteTarget._id || deleteTarget.id}`)
            setDeleteTarget(null)
            load(query)
        } catch (err) {
            setError(err.message || "Could not delete doctor")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold text-emerald-900">Doctors</h1>
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search doctors..."
                        className="w-full pl-9 pr-3 py-2 rounded-full border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>
            </div>

            {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {loading ? (
                    <p className="text-center text-emerald-600 py-10">Loading...</p>
                ) : doctors.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No doctors found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-emerald-100 bg-emerald-50/50">
                                    <th className="py-3 px-4">Doctor</th>
                                    <th className="py-3 px-4">Specialization</th>
                                    <th className="py-3 px-4">Fee</th>
                                    <th className="py-3 px-4">Appointments</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((d) => (
                                    <tr key={d._id || d.id} className="border-b border-emerald-50 hover:bg-emerald-50/30">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {d.imageUrl ? (
                                                        <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Users className="w-5 h-5 text-emerald-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{d.name}</p>
                                                    <p className="text-xs text-gray-500">{d.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{d.specialization || "—"}</td>
                                        <td className="py-3 px-4 text-gray-600">{currency(d.fee)}</td>
                                        <td className="py-3 px-4 text-gray-600">{d.appointmentsTotal ?? 0}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => toggleAvailability(d._id || d.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                                                    d.availability === "Available"
                                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                        : "bg-gray-100 text-gray-600 border-gray-200"
                                                }`}
                                            >
                                                {d.availability === "Available" ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                {d.availability}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/doctors/${d._id || d.id}/edit`}
                                                    className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(d)}
                                                    className="p-2 rounded-full hover:bg-rose-50 text-rose-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete doctor?"
                message={`This will permanently remove ${deleteTarget?.name || "this doctor"}. This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </div>
    )
}

export default ListDoctors
