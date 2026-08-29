import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { formatDoctorTimeString } from '../utils/format'
import { UploadCloud, Plus, X, UserPlus } from 'lucide-react'

const AddDoctor = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: "", email: "", password: "", specialization: "", experience: "",
        qualifications: "", location: "", about: "", fee: "", availability: "Available",
    })
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const [schedule, setSchedule] = useState({}) // { "2026-01-15": ["10:00 AM", ...] }
    const [slotDate, setSlotDate] = useState("")
    const [slotTime, setSlotTime] = useState("")

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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

        if (!form.name || !form.email || !form.password) {
            setError("Name, email, and password are required.")
            return
        }

        setSubmitting(true)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => fd.append(k, v))
            fd.append("schedule", JSON.stringify(schedule))
            if (image) fd.append("image", image)

            await api.post("/doctors", fd, { isForm: true })
            setSuccess("Doctor added successfully.")
            setTimeout(() => navigate("/list-doctors"), 900)
        } catch (err) {
            setError(err.message || "Could not add doctor")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <UserPlus className="w-6 h-6 text-emerald-600" />
                <h1 className="text-2xl font-extrabold text-emerald-900">Add Doctor</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-6">
                {/* Image upload */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Photo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <UploadCloud className="w-8 h-8 text-emerald-300" />
                            )}
                        </div>
                        <label className="cursor-pointer px-4 py-2 rounded-full border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition">
                            Choose Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                {/* Basic fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name *">
                        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <Field label="Email *">
                        <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Field>
                    <Field label="Password *">
                        <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </Field>
                    <Field label="Specialization">
                        <input className="input" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                    </Field>
                    <Field label="Experience">
                        <input className="input" placeholder="e.g. 8 years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                    </Field>
                    <Field label="Qualifications">
                        <input className="input" placeholder="e.g. MBBS, MD" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
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

                {/* Schedule builder */}
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
                                    {times.map((t) => (
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
                    {submitting ? "Adding..." : "Add Doctor"}
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

export default AddDoctor
