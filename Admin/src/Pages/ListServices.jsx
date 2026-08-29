import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ConfirmModal from '../components/ConfirmModal'
import { currency } from '../utils/format'
import { Pencil, Trash2, ListChecks } from 'lucide-react'

const ListServices = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const load = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await api.get("/services")
            setServices(res.data || [])
        } catch (err) {
            setError(err.message || "Could not load services")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await api.del(`/services/${deleteTarget._id}`)
            setDeleteTarget(null)
            load()
        } catch (err) {
            setError(err.message || "Could not delete service")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-emerald-900">Services</h1>
                <Link to="/add-service" className="text-sm px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
                    + Add Service
                </Link>
            </div>

            {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

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
                                    <th className="py-3 px-4">Slots</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((s) => (
                                    <tr key={s._id} className="border-b border-emerald-50 hover:bg-emerald-50/30">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {s.imageUrl ? (
                                                        <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ListChecks className="w-5 h-5 text-emerald-300" />
                                                    )}
                                                </div>
                                                <p className="font-semibold text-gray-900">{s.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{currency(s.price)}</td>
                                        <td className="py-3 px-4 text-gray-600">{(s.dates || []).length} dates</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${s.available ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                                {s.available ? "Available" : "Unavailable"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/services/${s._id}/edit`} className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => setDeleteTarget(s)} className="p-2 rounded-full hover:bg-rose-50 text-rose-500">
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
                title="Delete service?"
                message={`This will permanently remove "${deleteTarget?.name}". This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
            />
        </div>
    )
}

export default ListServices
