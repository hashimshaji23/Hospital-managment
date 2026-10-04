export function formatDoctorTimeString(timeStr) {
  if (!timeStr) return null
  if (/am|pm/i.test(timeStr) && !timeStr.includes("T")) return timeStr.trim()
  const [hhRaw, mmRaw] = timeStr.split(":").map(Number)
  if (Number.isNaN(hhRaw) || Number.isNaN(mmRaw)) return null
  const ampm = hhRaw >= 12 ? "PM" : "AM"
  let hour12 = hhRaw % 12
  if (hour12 === 0) hour12 = 12
  return `${hour12}:${String(mmRaw).padStart(2, "0")} ${ampm}`
}
