import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardStyles as ds } from '../../assets/dummyStyles'
import { CalendarCheck, Users, Wallet, Clock3, Phone, RefreshCw, ArrowRight } from 'lucide-react'
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

const AppointmentMiniCard = ({ a }) => (
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
  </div>
)

const DoctorDashboard = () => {
  const doctor = doctorInfoStore.get()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    if (!doctor?._id) {
      setError("Doctor session not found. Please log in again.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await api.get(`/appointments/doctor/${doctor._id}?limit=200`)
      setAppointments(res.appointment || [])
    } catch (err) {
      setError(err.message || "Could not load appointments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

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

  return (
    <div className={ds.pageContainer}>
      <div className={ds.contentWrapper}>
        <div className={ds.headerContainer}>
          <div>
            <h1 className={ds.headerTitle}>Welcome, Dr. {doctor?.name}</h1>
            <p className={ds.headerSubtitle}>
              {doctor?.specialization ? `${doctor.specialization} · ` : ""}Overview of your appointments
            </p>
          </div>
          <button onClick={load} className={ds.refreshButton}>
            <RefreshCw className="w-4 h-4 inline mr-1" /> Refresh
          </button>
        </div>

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
          {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
          {loading ? (
            <p className="text-emerald-600">Loading...</p>
          ) : todays.length ? (
            <div className={ds.cardsGrid}>
              {todays.map((a) => <AppointmentMiniCard key={a._id} a={a} />)}
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
              {recent.map((a) => <AppointmentMiniCard key={a._id} a={a} />)}
              {!appointments.length && <p className="text-emerald-700 col-span-full text-center py-8">No appointments yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
