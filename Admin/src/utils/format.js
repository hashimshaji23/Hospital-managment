// Formats a native date (YYYY-MM-DD) + time (HH:MM, 24h) input pair into the
// "D Mon YYYY • H:MM AM/PM" string format the backend's Service slot parser expects.
export function formatServiceSlotString(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null
    const d = new Date(`${dateStr}T00:00:00`)
    if (isNaN(d)) return null
    const day = d.getDate()
    const monShort = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    const [hhRaw, mmRaw] = timeStr.split(':').map(Number)
    if (Number.isNaN(hhRaw) || Number.isNaN(mmRaw)) return null
    const ampm = hhRaw >= 12 ? 'PM' : 'AM'
    let hour12 = hhRaw % 12
    if (hour12 === 0) hour12 = 12
    return `${day} ${monShort} ${year} • ${hour12}:${String(mmRaw).padStart(2, '0')} ${ampm}`
}

// Formats a time input (HH:MM 24h) into "H:MM AM/PM" for doctor schedules.
export function formatDoctorTimeString(timeStr) {
    if (!timeStr) return null
    const [hhRaw, mmRaw] = timeStr.split(':').map(Number)
    if (Number.isNaN(hhRaw) || Number.isNaN(mmRaw)) return null
    const ampm = hhRaw >= 12 ? 'PM' : 'AM'
    let hour12 = hhRaw % 12
    if (hour12 === 0) hour12 = 12
    return `${hour12}:${String(mmRaw).padStart(2, '0')} ${ampm}`
}

export const statusBadgeClass = (status) => {
    const key = (status || "").toLowerCase()
    const map = {
        completed: "bg-slate-100 text-slate-700 border-slate-200",
        confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        canceled: "bg-rose-100 text-rose-700 border-rose-200",
        rescheduled: "bg-indigo-100 text-indigo-700 border-indigo-200",
    }
    return `px-3 py-1 rounded-full text-xs font-semibold border ${map[key] || "bg-blue-100 text-blue-700 border-blue-200"}`
}

export const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
