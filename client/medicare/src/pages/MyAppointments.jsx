import React, { useEffect, useState } from 'react'
import { appointmentPageStyles as aps, cardStyles as cs, badgeStyles as bs } from '../assets/dummyStyles'
import { useAuth, SignInButton, useUser } from '@clerk/clerk-react'
import { Calendar, Clock, Users, XCircle } from 'lucide-react'
import { api } from '../utils/api'

const statusBadgeClass = (status) => {
  const key = (status || "").toLowerCase()
  return bs.statusBadge[key] || bs.statusBadge.default
}

const AppointmentCard = ({ item, kind, onCancel }) => {
  const isDoctor = kind === "doctor"
  const name = isDoctor ? item.doctorName : item.serviceName
  const image = isDoctor ? item.doctorImage?.url : item.serviceImage?.url
  const sub = isDoctor ? item.speciality : "Service"
  const time = isDoctor ? item.time : `${item.hour}:${String(item.minute).padStart(2, "0")} ${item.ampm}`
  const fee = isDoctor ? item.fees : item.fees ?? item.payment?.amount

  const cancellable = item.status !== "Canceled" && item.status !== "Completed"

  return (
    <div className={cs.doctorCard}>
      <div className={cs.doctorImageContainer}>
        {image ? <img src={image} alt={name} className={cs.image} /> : <Users className="w-10 h-10 text-emerald-300" />}
      </div>
      <p className={cs.doctorName}>{name}</p>
      {sub && <p className={cs.specialization}>{sub}</p>}

      <div className={cs.dateContainer}>
        <Calendar className="w-4 h-4 text-emerald-600" />
        <span>{item.date}</span>
      </div>
      <div className={cs.timeContainer}>
        <Clock className="w-4 h-4 text-emerald-600" />
        <span>{time}</span>
      </div>

      <p className={cs.price}>₹{fee}</p>

      <div className={cs.badgesContainer}>
        <span className={item.payment?.method === "Online" ? bs.paymentBadge.online : bs.paymentBadge.cash}>
          {item.payment?.method || "Cash"}
        </span>
        <span className={statusBadgeClass(item.status)}>{item.status}</span>
      </div>

      {item.status === "Rescheduled" && item.rescheduledTo?.date && (
        <p className={cs.rescheduledText}>
          <span className={cs.rescheduledSpan}>Rescheduled to:</span> {item.rescheduledTo.date}
        </p>
      )}

      {cancellable && (
        <button
          onClick={() => onCancel(item._id, kind)}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
        >
          <XCircle className="w-4 h-4" /> Cancel
        </button>
      )}
    </div>
  )
}

const MyAppointments = () => {
  const { isSignedIn, getToken } = useAuth()
  const { isLoaded } = useUser()

  const [doctorAppointments, setDoctorAppointments] = useState([])
  const [serviceAppointments, setServiceAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const token = await getToken()
      const [docRes, svcRes] = await Promise.all([
        api.get("/appointments/me", { token }),
        api.get("/service-appointments/me", { token }),
      ])
      setDoctorAppointments(docRes.appointments || [])
      setServiceAppointments(svcRes.appointments || [])
    } catch (err) {
      setError(err.message || "Could not load your appointments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isSignedIn) load() }, [isSignedIn])

  const handleCancel = async (id, kind) => {
    try {
      const path = kind === "doctor" ? `/appointments/${id}/cancel` : `/service-appointments/${id}/cancel`
      await api.post(path, {})
      load()
    } catch (err) {
      setError(err.message || "Could not cancel appointment")
    }
  }

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className={aps.pageContainer}>
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-md mt-10">
          <p className="text-emerald-800 font-medium mb-4">Please sign in to view your appointments.</p>
          <SignInButton mode="modal">
            <button className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold">Sign In</button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className={aps.pageContainer}>
      <div className={aps.maxWidthContainer}>
        <h1 className={aps.doctorTitle}>My Doctor Appointments</h1>
        {error && <p className="text-center text-rose-600 mb-4">{error}</p>}
        {loading ? (
          <p className={aps.loadingText}>Loading...</p>
        ) : (
          <div className={aps.doctorGrid}>
            {doctorAppointments.map((a) => (
              <AppointmentCard key={a._id} item={a} kind="doctor" onCancel={handleCancel} />
            ))}
            {!doctorAppointments.length && <p className={aps.emptyStateText}>No doctor appointments yet.</p>}
          </div>
        )}

        <h1 className={aps.serviceTitle}>My Service Appointments</h1>
        {loading ? (
          <p className={aps.serviceLoadingText}>Loading...</p>
        ) : (
          <div className={aps.serviceGrid}>
            {serviceAppointments.map((a) => (
              <AppointmentCard key={a._id} item={a} kind="service" onCancel={handleCancel} />
            ))}
            {!serviceAppointments.length && <p className={aps.serviceEmptyStateText}>No service appointments yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments
