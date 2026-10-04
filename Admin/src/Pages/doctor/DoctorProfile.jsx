import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'
import { formatDoctorTimeString, currency } from '../../utils/format'
import {
    Camera,
    Save,
    Star,
    Wallet,
    Award,
    Plus,
    Trash2,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    User,
    Mail,
    MapPin,
    Stethoscope,
} from 'lucide-react'

const DoctorProfile = () => {
    const { user, updateUser } = useAuth()
    const doctorId = user?._id || user?.id
    const fileInputRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [error, setError] = useState("")

    const [form, setForm] = useState({
        name: "",
        specialization: "",
        experience: "",
        qualifications: "",
        location: "",
        fee: 0,
        about: "",
        email: "",
    })

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [availability, setAvailability] = useState("Available")
    const [schedule, setSchedule] = useState({})

    // Add slot helper state
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3500)
    }

    const loadProfile = async () => {
        if (!doctorId) return
        setLoading(true)
        setError("")
        try {
            const res = await api.get(`/doctors/${doctorId}`)
            const d = res.data || {}
            setForm({
                name: d.name || "",
                specialization: d.specialization || "",
                experience: d.experience || "",
                qualifications: d.qualifications || "",
                location: d.location || "",
                fee: d.fee ?? 0,
                about: d.about || "",
                email: d.email || "",
            })
            setAvailability(d.availability || "Available")
            setSchedule(d.schedule && typeof d.schedule === "object" ? d.schedule : {})
            setImagePreview(d.imageUrl || "")
            updateUser(d)
        } catch (err) {
            setError(err.message || "Failed to load doctor profile")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [doctorId])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const addTimeSlot = () => {
        const timeFormatted = formatDoctorTimeString(selectedTime)
        if (!selectedDate || !timeFormatted) return

        setSchedule((prev) => {
            const existing = prev[selectedDate] || []
            if (existing.includes(timeFormatted)) return prev
            const updated = [...existing, timeFormatted]
            return { ...prev, [selectedDate]: updated }
        })
        setSelectedTime("")
    }

    const removeTimeSlot = (date, slot) => {
        setSchedule((prev) => {
            const list = (prev[date] || []).filter((s) => s !== slot)
            if (list.length === 0) {
                const next = { ...prev }
                delete next[date]
                return next
            }
            return { ...prev, [date]: list }
        })
    }

    const removeDateGroup = (date) => {
        setSchedule((prev) => {
            const next = { ...prev }
            delete next[date]
            return next
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!doctorId) return
        setSaving(true)
        setError("")

        try {
            const fd = new FormData()
            fd.append("name", form.name)
            fd.append("specialization", form.specialization)
            fd.append("experience", form.experience)
            fd.append("qualifications", form.qualifications)
            fd.append("location", form.location)
            fd.append("fee", String(form.fee))
            fd.append("about", form.about)
            fd.append("availability", availability)
            fd.append("schedule", JSON.stringify(schedule))
            if (imageFile) {
                fd.append("image", imageFile)
            }

            const res = await api.put(`/doctors/${doctorId}`, fd, { isForm: true })
            if (res.data) {
                updateUser(res.data)
                setImageFile(null)
                setImagePreview(res.data.imageUrl || imagePreview)
            }
            showToast("success", "Doctor profile and schedule updated successfully!")
        } catch (err) {
            setError(err.message || "Failed to update profile")
            showToast("error", err.message || "Update failed")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
                <p className="text-sm font-semibold text-emerald-800">Loading profile data...</p>
            </div>
        )
    }

    const isAvailable = availability.toLowerCase() === "available"

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Toast feedback */}
            {toast && (
                <div className="fixed top-20 right-6 z-50">
                    <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all ${
                            toast.type === "success"
                                ? "bg-emerald-600 text-white border-emerald-500"
                                : "bg-rose-600 text-white border-rose-500"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <AlertCircle className="w-4 h-4" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar Upload */}
                    <div className="relative group">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-emerald-50 border-2 border-emerald-200 shadow-md flex items-center justify-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt={form.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-emerald-300" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition cursor-pointer"
                            title="Upload new photo"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-black text-emerald-950">Dr. {form.name}</h1>
                                <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                                    {form.specialization || "Specialization not specified"}
                                </p>
                            </div>

                            {/* Quick Availability Switch */}
                            <div className="flex items-center gap-2 self-center sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => setAvailability(isAvailable ? "Unavailable" : "Available")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                        isAvailable
                                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                            : "bg-gray-100 border-gray-300 text-gray-700"
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-gray-400"}`} />
                                    {isAvailable ? "Status: Available" : "Status: Unavailable"}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-medium text-gray-600 flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-emerald-600" />
                                {form.experience || "Experience not added"}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Wallet className="w-4 h-4 text-emerald-600" />
                                Fee: {currency(form.fee)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                {form.location || "Hospital Main OPD"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Profile Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-emerald-600" />
                        Professional & Personal Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Specialization
                            </label>
                            <input
                                type="text"
                                value={form.specialization}
                                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="e.g. Cardiologist, Dermatologist..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Experience
                            </label>
                            <input
                                type="text"
                                value={form.experience}
                                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="e.g. 8+ Years"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Qualifications
                            </label>
                            <input
                                type="text"
                                value={form.qualifications}
                                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="e.g. MBBS, MD, FRCS"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Consultation Fee (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.fee}
                                onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Clinic / Room Location
                            </label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="e.g. Block B, Room 204"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                Login Email (Read Only)
                            </label>
                            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{form.email || "No email"}</span>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                                About / Professional Bio
                            </label>
                            <textarea
                                rows={4}
                                value={form.about}
                                onChange={(e) => setForm({ ...form, about: e.target.value })}
                                className="w-full rounded-xl border border-emerald-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="Share your clinical background, specialties, and approach to patient care..."
                            />
                        </div>
                    </div>
                </div>

                {/* Consultation Schedule Manager */}
                <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                Available Consultation Schedule
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Set up time slots for patient appointments on specific dates.
                            </p>
                        </div>
                    </div>

                    {/* Add slot picker */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-full sm:w-auto flex-1">
                            <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="w-full sm:w-auto flex-1">
                            <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                                Select Time Slot
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="w-full sm:w-auto self-end">
                            <button
                                type="button"
                                onClick={addTimeSlot}
                                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Slot
                            </button>
                        </div>
                    </div>

                    {/* Schedule slots list */}
                    {Object.keys(schedule).length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700">No active consultation slots</p>
                            <p className="text-xs text-gray-400 mt-0.5">Use the date and time picker above to create slots.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(schedule)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([date, slots]) => (
                                    <div
                                        key={date}
                                        className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/40 transition flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                                            <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                {date}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeDateGroup(date)}
                                                className="text-rose-500 hover:text-rose-700 p-1 text-xs cursor-pointer"
                                                title="Delete all slots for this date"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {(slots || []).map((slot) => (
                                                <span
                                                    key={slot}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-emerald-200 text-emerald-800 shadow-2xs"
                                                >
                                                    <Clock className="w-3 h-3 text-emerald-500" />
                                                    {slot}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimeSlot(date, slot)}
                                                        className="text-gray-400 hover:text-rose-500 ml-1 cursor-pointer"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3.5 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving Changes..." : "Save Profile & Schedule"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DoctorProfile
