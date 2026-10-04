import React, { useEffect, useState } from 'react'
import { listPageStyles as ls } from '../../assets/dummyStyles'
import { Search, X, Calendar as CalendarIcon, Phone } from 'lucide-react'
import { api, doctorInfoStore } from '../../utils/api'
import { formatDoctorTimeString } from '../../utils/format'

const statusClass = (status) => {
  switch (status) {
    case "Completed": return ls.statusBadgeComplete
    case "Canceled": return ls.statusBadgeCancelled
    case "Confirmed": return ls.statusBadgeConfirmed
    case "Rescheduled": return ls.statusBadgeRescheduled
    default: return ls.statusBadgePending
  }
}

const statusOptions = ["Pending", "Confirmed", "Completed", "Canceled"]

const DoctorAppointments = () => {
  const doctor = doctorInfoStore.get()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [reschedulingId, setReschedulingId] = useState(null)
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "" })

  const load = async (q = search, status = statusFilter) => {
    if (!doctor?._id) {
      setError("Please log in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (q) params.set("search", q)
      if (status) params.set("status", status)
      params.set("limit", "200")
      const res = await api.get(`/appointments/doctor/${doctor._id}?${params.toString()}`)
      setAppointments(res.appointment || [])
    } catch (err) {
      setError(err.message || "Could not load appointments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => load(search, statusFilter), 350)
    return () => clearTimeout(t)
  }, [search, statusFilter])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const saveReschedule = async (id) => {
    const time = formatDoctorTimeString(rescheduleForm.time)
    if (!rescheduleForm.date || !time) return
    try {
      await api.put(`/appointments/${id}`, { date: rescheduleForm.date, time })
      setReschedulingId(null)
      setRescheduleForm({ date: "", time: "" })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={ls.pageContainer}>
      <div className={ls.contentWrapper}>
        <div className={ls.headerContainer}>
          <div>
            <h1 className={ls.headerTitle}>My Appointments</h1>
            <p className={ls.headerSubtitle}>Manage bookings, statuses, and reschedules</p>
          </div>
          <div className={ls.searchFilterContainer}>
            <div className={ls.searchContainer}>
              <span className={ls.searchIconContainer}><Search className={ls.searchIcon} /></span>
              <input className={ls.searchInput} placeholder="Search patient/mobile"
                value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button className={ls.clearSearchButton} onClick={() => setSearch("")}>
                  <X className={ls.clearSearchIcon} />
                </button>
              )}
            </div>
            <select className={ls.statusFilter} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>

        {error && <div className={ls.errorContainer}>{error}</div>}
        {loading ? (
          <div className={ls.loadingContainer}>Loading...</div>
        ) : (
          <div className={ls.appointmentsGrid}>
            {appointments.map((a) => {
              const locked = a.status === "Completed" || a.status === "Canceled"
              return (
                <div key={a._id} className={ls.appointmentCard}>
                  <div className={ls.cardHeader}>
                    <div className={ls.cardAvatar}>
                      <span className={ls.cardAvatarFallback}>{(a.patientName || "?")[0]}</span>
                    </div>
                    <div className={ls.cardContent}>
                      <p className={ls.cardPatientName}>{a.patientName}</p>
                      <p className={ls.cardPatientInfo}>{a.age ? `${a.age} yrs` : ""} {a.gender}</p>
                    </div>
                  </div>

                  <div className={ls.dateTimeSection}>
                    <div className={ls.dateTimeContainer}>
                      <CalendarIcon className={ls.calendarIcon} />
                      <span className={ls.dateText}>{a.date} · {a.time}</span>
                    </div>
                    <span className={ls.feeText}>₹{a.fees}</span>
                  </div>

                  <div className={ls.contactStatusSection}>
                    <div className={ls.phoneContainer}>
                      <Phone className={ls.phoneIcon} /> <span className={ls.phoneNumber}>{a.mobile}</span>
                    </div>
                    <div className={ls.statusContainer}>
                      <span className={`${ls.statusBadgeBase} ${statusClass(a.status)}`}>{a.status}</span>
                      <select
                        disabled={locked}
                        value={statusOptions.includes(a.status) ? a.status : "Pending"}
                        onChange={(e) => updateStatus(a._id, e.target.value)}
                        className={`${ls.statusSelect} ${locked ? ls.statusSelectDisabled : ls.statusSelectEnabled}`}
                      >
                        {a.status === "Rescheduled" && <option value="Rescheduled">Rescheduled</option>}
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className={ls.rescheduleContainer}>
                    {reschedulingId === a._id ? (
                      <div className={ls.rescheduleForm}>
                        <input type="date" className={ls.dateInput}
                          value={rescheduleForm.date} onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} />
                        <input type="time" className={ls.timeInput}
                          value={rescheduleForm.time} onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })} />
                        <div className={ls.rescheduleButtons}>
                          <button className={ls.saveButton} onClick={() => saveReschedule(a._id)}>Save</button>
                          <button className={ls.cancelButton} onClick={() => setReschedulingId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled={locked}
                        onClick={() => {
                          setReschedulingId(a._id)
                          setRescheduleForm({ date: a.date || "", time: "" })
                        }}
                        className={`${ls.rescheduleButton} ${locked ? ls.rescheduleButtonDisabled : ls.rescheduleButtonEnabled}`}
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            {!appointments.length && <p className="text-emerald-700 col-span-full text-center py-8">No appointments found.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments
