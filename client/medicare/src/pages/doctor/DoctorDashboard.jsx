import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardStyles as ds } from '../../assets/dummyStyles'
import { CalendarCheck, Users, Wallet, Clock3, Phone, RefreshCw, ArrowRight, Check, X, CircleDot } from 'lucide-react'
import { api, doctorInfoStore } from '../../utils/api'

const statusClass = (status) => {
  switch (status) {
    case "Completed": return ds.statusBadgeComplete
    case "Canceled": return ds.statusBadgeCancelled
    case "Confirmed": return ds.statusBadgeConfirmed
    case "Rescheduled": return ds.statusBadgeRescheduled
    default: return ds.statusBadgePending
  }
}

const todayKey = () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const AppointmentMiniCard = ({ a, onUpdateStatus }) => {
  const locked = a.status === "Completed" || a.status === "Canceled"
  return (
    <div className={ds.appointmentCard}>
      <div className={ds.cardHeader}>
        <div className={ds.cardAvatar}>
          <span className={ds.cardAvatarFallback}>{(a.patientName || "?")[0]}</span>
        </div>
        <div className={ds.cardContent}>
          <p className={ds.cardPatientName}>{a.patientName}</p>
          <p className={ds.cardPatientInfo}>{a.age ? `${a.age} yrs` : ""} {a.gender}</p>
          <div className={ds.cardPhoneContainer}>
            <Phone className={ds.cardPhoneIcon} /> {a.mobile}
          </div>
        </div>
      </div>
      <div className={ds.dateTimeContainer}>
        <span className={ds.dateText}>{a.date}</span>
        <span className={ds.timeText}>{a.time}</span>
      </div>
      <div className={ds.cardFooter}>
        <span className={ds.feeText}>₹{a.fees}</span>
        <div className={ds.statusContainer}>
          <span className={`${ds.statusBadgeBase} ${statusClass(a.status)}`}>{a.status}</span>
        </div>
      </div>

      {!locked && onUpdateStatus && (
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-emerald-100">
          <button
            onClick={() => onUpdateStatus(a._id, "Completed")}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" /> Complete
          </button>
          <button
            onClick={() => onUpdateStatus(a._id, "Canceled")}
            className="py-1.5 px-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition cursor-pointer"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(doctorInfoStore.get())
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [togglingAvail, setTogglingAvail] = useState(false)

  const load = async () => {
    if (!doctor?._id) {
      setError("Doctor session not found. Please log in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const [apptRes, docRes] = await Promise.all([
        api.get(`/appointments/doctor/${doctor._id}?limit=200`),
        api.get(`/doctors/${doctor._id}`).catch(() => null),
      ])
      setAppointments(apptRes.appointment || [])
      if (docRes?.data) {
        doctorInfoStore.set(docRes.data)
        setDoctor(docRes.data)
      }
    } catch (err) {
      setError(err.message || "Could not load appointments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggleAvailability = async () => {
    if (!doctor?._id || togglingAvail) return
    setTogglingAvail(true)
    try {
      const res = await api.post(`/doctors/${doctor._id}/toggle-availability`, {})
      if (res.data) {
        doctorInfoStore.set(res.data)
        setDoctor(res.data)
      }
    } catch (err) {
      setError(err.message || "Could not toggle availability")
    } finally {
      setTogglingAvail(false)
    }
  }

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status: newStatus })
      await load()
    } catch (err) {
      setError(err.message || "Could not update appointment status")
    }
  }

  const total = appointments.length
  const completed = appointments.filter((a) => a.status === "Completed" || a.status === "Confirmed").length
  const pending = appointments.filter((a) => a.status === "Pending").length
  const earnings = appointments
    .filter((a) => a.status === "Completed" || a.status === "Confirmed")
    .reduce((sum, a) => sum + (a.fees || 0), 0)
  const uniquePatients = new Set(appointments.map((a) => a.mobile || a.patientName).filter(Boolean)).size

  const today = todayKey()
  const todays = appointments.filter((a) => a.date === today)
  const recent = [...appointments]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 8)

  const isAvailable = (doctor?.availability || "Available").toLowerCase() === "available"

  return (
    <div className={ds.pageContainer}>
      <div className={ds.contentWrapper}>
        <div className={ds.headerContainer}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={ds.headerTitle}>Welcome, Dr. {doctor?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {doctor?.specialization || "Doctor"}
              </span>
            </div>
            <p className={ds.headerSubtitle}>
              {doctor?.experience ? `${doctor.experience} exp · ` : ""}Overview of your schedule & patients
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAvailability}
              disabled={togglingAvail}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                isAvailable
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              {togglingAvail ? "Updating..." : isAvailable ? "Available" : "Unavailable"}
            </button>

            <button onClick={load} className={ds.refreshButton}>
              <RefreshCw className={`w-4 h-4 inline mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className={ds.statsGrid}>
          <div className={ds.statCard}>
            <div className={ds.statContent}>
              <div className={ds.statTextContainer}>
                <p className={ds.statTitle}>Total Appointments</p>
                <p className={ds.statValue}>{loading ? "—" : total}</p>
              </div>
              <div className={`${ds.statIconContainer} ${ds.accentTopEmerald} ${ds.accentBottomEmerald}`}>
                <CalendarCheck className={ds.statIcon} />
              </div>
            </div>
          </div>
          <div className={ds.statCard}>
            <div className={ds.statContent}>
              <div className={ds.statTextContainer}>
                <p className={ds.statTitle}>Confirmed / Completed</p>
                <p className={ds.statValue}>{loading ? "—" : completed}</p>
              </div>
              <div className={`${ds.statIconContainer} ${ds.accentTopEmeraldLight} ${ds.accentBottomEmerald}`}>
                <Users className={ds.statIcon} />
              </div>
            </div>
          </div>
          <div className={ds.statCard}>
            <div className={ds.statContent}>
              <div className={ds.statTextContainer}>
                <p className={ds.statTitle}>Pending</p>
                <p className={ds.statValue}>{loading ? "—" : pending}</p>
              </div>
              <div className={`${ds.statIconContainer} ${ds.accentTopAmber} ${ds.accentBottomAmber}`}>
                <Clock3 className={ds.statIcon} />
              </div>
            </div>
          </div>
          <div className={ds.statCard}>
            <div className={ds.statContent}>
              <div className={ds.statTextContainer}>
                <p className={ds.statTitle}>Earnings</p>
                <p className={ds.statValue}>{loading ? "—" : `₹${earnings}`}</p>
                <p className="text-xs text-emerald-700/70 mt-1">{loading ? "" : `${uniquePatients} patients`}</p>
              </div>
              <div className={`${ds.statIconContainer} ${ds.accentTopRose} ${ds.accentBottomRose}`}>
                <Wallet className={ds.statIcon} />
              </div>
            </div>
          </div>
        </div>

        <div className={`${ds.appointmentsContainer} mb-6`}>
          <div className={ds.appointmentsHeader}>
            <h2 className={ds.appointmentsTitle}>Today ({todays.length})</h2>
            <Link to="/doctor/appointments" className="text-sm text-emerald-700 hover:underline inline-flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <p className="text-emerald-600">Loading...</p>
          ) : todays.length ? (
            <div className={ds.cardsGrid}>
              {todays.map((a) => (
                <AppointmentMiniCard key={a._id} a={a} onUpdateStatus={handleStatusChange} />
              ))}
            </div>
          ) : (
            <p className="text-emerald-700 text-center py-6">No appointments scheduled for today.</p>
          )}
        </div>

        <div className={ds.appointmentsContainer}>
          <div className={ds.appointmentsHeader}>
            <h2 className={ds.appointmentsTitle}>Recent Appointments</h2>
            <Link to="/doctor/appointments" className="text-sm text-emerald-700 hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <p className="text-emerald-600">Loading...</p>
          ) : (
            <div className={ds.cardsGrid}>
              {recent.map((a) => (
                <AppointmentMiniCard key={a._id} a={a} onUpdateStatus={handleStatusChange} />
              ))}
              {!appointments.length && (
                <p className="text-emerald-700 col-span-full text-center py-8">No appointments yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
