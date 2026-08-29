import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { formatServiceSlotString } from '../utils/format'
import { UploadCloud, Plus, X, ArrowLeft } from 'lucide-react'

const EditService = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(null)
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [instructions, setInstructions] = useState([])
    const [instructionInput, setInstructionInput] = useState("")
    const [slots, setSlots] = useState([])
    const [slotDate, setSlotDate] = useState("")
    const [slotTime, setSlotTime] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        api.get(`/services/${id}`).then((res) => {
            const s = res.data
            setForm({
                name: s.name || "", about: s.about || "", shortDescription: s.shortDescription || "",
                price: s.price || "", availability: s.available === false ? "unavailable" : "available",
            })
            setInstructions(s.instructions || [])
            // Flatten existing slots map back into formatted strings for editing.
            // Stored keys are ISO dates (YYYY-MM-DD); reformat to "D Mon YYYY" to match
            // the same "D Mon YYYY • H:MM AM/PM" format the backend parser expects.
            const flat = []
            Object.entries(s.slots || {}).forEach(([dateKey, times]) => {
                const d = new Date(`${dateKey}T00:00:00`)
                const label = isNaN(d)
                    ? dateKey
                    : `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getFullYear()}`
                    ;(times || []).forEach((t) => flat.push(`${label} • ${t}`))
            })
            setSlots(flat)
            setPreview(s.imageUrl || null)
        }).catch((err) => setError(err.message || "Could not load service")).finally(() => setLoading(false))
    }, [id])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const addInstruction = () => {
        if (!instructionInput.trim()) return
        setInstructions((list) => [...list, instructionInput.trim()])
        setInstructionInput("")
    }
    const removeInstruction = (i) => setInstructions((list) => list.filter((_, idx) => idx !== i))

    const addSlot = () => {
        const formatted = formatServiceSlotString(slotDate, slotTime)
        if (!formatted) return
        setSlots((list) => (list.includes(formatted) ? list : [...list, formatted]))
        setSlotTime("")
    }
    const removeSlot = (s) => setSlots((list) => list.filter((x) => x !== s))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append("name", form.name)
            fd.append("about", form.about)
            fd.append("shortDescription", form.shortDescription)
            fd.append("price", form.price)
            fd.append("availability", form.availability)
            fd.append("instructions", JSON.stringify(instructions))
            fd.append("slots", JSON.stringify(slots))
            if (image) fd.append("image", image)

            await api.put(`/services/${id}`, fd, { isForm: true })
            setSuccess("Service updated successfully.")
            setTimeout(() => navigate("/list-services"), 900)
        } catch (err) {
            setError(err.message || "Could not update service")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="text-center text-emerald-600 py-10">Loading...</p>
    if (!form) return <p className="text-center text-rose-600 py-10">{error || "Service not found"}</p>

    return (
        <div className="max-w-3xl mx-auto">
            <Link to="/list-services" className="inline-flex items-center gap-1 text-sm text-emerald-700 mb-4 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
            <h1 className="text-2xl font-extrabold text-emerald-900 mb-6">Edit Service</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Image</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                            {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <UploadCloud className="w-8 h-8 text-emerald-300" />}
                        </div>
                        <label className="cursor-pointer px-4 py-2 rounded-full border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Service Name">
                        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <Field label="Price (₹)">
                        <input type="number" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </Field>
                    <Field label="Short Description">
                        <input className="input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
                    </Field>
                    <Field label="Availability">
                        <select className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </Field>
                </div>

                <Field label="About">
                    <textarea rows={3} className="input" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
                </Field>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Instructions</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            className="input"
                            value={instructionInput}
                            onChange={(e) => setInstructionInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInstruction() } }}
                        />
                        <button type="button" onClick={addInstruction} className="px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-semibold text-sm hover:bg-emerald-200 transition shrink-0">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    {instructions.length > 0 && (
                        <ul className="space-y-1">
                            {instructions.map((ins, i) => (
                                <li key={i} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-1.5 text-sm">
                                    {ins}
                                    <button type="button" onClick={() => removeInstruction(i)}><X className="w-3.5 h-3.5" /></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Available Slots</label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        <input type="date" className="input" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
                        <input type="time" className="input" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} />
                        <button type="button" onClick={addSlot} className="px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-semibold text-sm hover:bg-emerald-200 transition inline-flex items-center gap-1 justify-center">
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>
                    {slots.length === 0 ? (
                        <p className="text-sm text-gray-400">No slots added yet.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {slots.map((s) => (
                                <span key={s} className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full text-xs border border-emerald-200">
                                    {s}
                                    <button type="button" onClick={() => removeSlot(s)}><X className="w-3 h-3" /></button>
                                </span>
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

export default EditService
