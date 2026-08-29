import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { formatDoctorTimeString } from '../utils/format'
import { UploadCloud, Plus, X, ArrowLeft } from 'lucide-react'

const EditDoctor = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(null)
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [schedule, setSchedule] = useState({})
    const [slotDate, setSlotDate] = useState("")
    const [slotTime, setSlotTime] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        api.get(`/doctors/${id}`).then((res) => {
            const d = res.data
            setForm({
                name: d.name || "", specialization: d.specialization || "", experience: d.experience || "",
                qualifications: d.qualifications || "", location: d.location || "", about: d.about || "",
                fee: d.fee || "", availability: d.availability || "Available",
            })
            setSchedule(d.schedule || {})
            setPreview(d.imageUrl || null)
        }).catch((err) => setError(err.message || "Could not load doctor")).finally(() => setLoading(false))
    }, [id])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const addSlot = () => {
        const time = formatDoctorTimeString(slotTime)
        if (!slotDate || !time) return
        setSchedule((s) => {
            const existing = s[slotDate] || []
            if (existing.includes(time)) return s
            return { ...s, [slotDate]: [...existing, time] }
        })
        setSlotTime("")
    }

    const removeSlot = (date, time) => {
        setSchedule((s) => {
            const next = { ...s, [date]: s[date].filter((t) => t !== time) }
            if (!next[date].length) delete next[date]
            return next
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setSubmitting(true)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => fd.append(k, v))
            fd.append("schedule", JSON.stringify(schedule))
            if (image) fd.append("image", image)

            await api.put(`/doctors/${id}`, fd, { isForm: true })
            setSuccess("Doctor updated successfully.")
            setTimeout(() => navigate("/list-doctors"), 900)
        } catch (err) {
            setError(err.message || "Could not update doctor")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="text-center text-emerald-600 py-10">Loading...</p>
    if (!form) return <p className="text-center text-rose-600 py-10">{error || "Doctor not found"}</p>

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/list-doctors" className="inline-flex items-center gap-1 text-sm text-emerald-700 mb-4 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Doctors
            </Link>
            <h1 className="text-2xl font-extrabold text-emerald-900 mb-6">Edit Doctor</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Photo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                            {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <UploadCloud className="w-8 h-8 text-emerald-300" />}
                        </div>
                        <label className="cursor-pointer px-4 py-2 rounded-full border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name">
                        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <Field label="Specialization">
                        <input className="input" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                    </Field>
                    <Field label="Experience">
                        <input className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                    </Field>
                    <Field label="Qualifications">
                        <input className="input" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
                    </Field>
                    <Field label="Location">
                        <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </Field>
                    <Field label="Consultation Fee (₹)">
                        <input type="number" min="0" className="input" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
                    </Field>
                    <Field label="Availability">
                        <select className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                    </Field>
                </div>

                <Field label="About">
                    <textarea rows={3} className="input" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
                </Field>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Availability Schedule</label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        <input type="date" className="input" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
                        <input type="time" className="input" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} />
                        <button type="button" onClick={addSlot} className="px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-semibold text-sm hover:bg-emerald-200 transition inline-flex items-center gap-1 justify-center">
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>
                    {Object.keys(schedule).length === 0 ? (
                        <p className="text-sm text-gray-400">No slots added yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(schedule).sort().map(([date, times]) => (
                                <div key={date} className="flex flex-wrap items-center gap-2 bg-emerald-50 rounded-xl p-3">
                                    <span className="text-sm font-semibold text-emerald-800">{date}</span>
                                    {(times || []).map((t) => (
                                        <span key={t} className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs border border-emerald-200">
                                            {t}
                                            <button type="button" onClick={() => removeSlot(date, t)}><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className="text-rose-600 text-sm">{error}</p>}
                {success && <p className="text-emerald-600 text-sm">{success}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-60"
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    )
}

const Field = ({ label, children }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
        {children}
    </div>
)

export default EditDoctor
