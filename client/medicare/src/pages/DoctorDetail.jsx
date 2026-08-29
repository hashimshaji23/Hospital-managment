import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doctorDetailStyles as ds } from '../assets/dummyStyles'
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react'
import {
  ArrowLeft, Star, Heart, Award, Users, MapPin, GraduationCap, Wallet,
  Info, CalendarDays, Clock, CheckCircle, Loader2,
} from 'lucide-react'
import { api } from '../utils/api'

const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr)
  if (isNaN(d)) return { weekday: "", day: dateStr, month: "" }
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString(undefined, { month: "short" }),
  }
}

const DoctorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [form, setForm] = useState({ patientName: "", mobile: "", age: "", gender: "", email: "" })

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    api.get(`/doctors/${id}`)
      .then((res) => { if (active) setDoctor(res.data) })
      .catch((err) => { if (active) setError(err.message || "Doctor not found") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        patientName: f.patientName || user.fullName || "",
        email: f.email || user.primaryEmailAddress?.emailAddress || "",
      }))
    }
  }, [user])

  const dates = useMemo(() => {
    if (!doctor?.schedule) return []
    return Object.keys(doctor.schedule).sort()
  }, [doctor])

  useEffect(() => {
    if (dates.length && !selectedDate) setSelectedDate(dates[0])
  }, [dates, selectedDate])

  const slots = doctor?.schedule?.[selectedDate] || []

  const isValid = form.patientName && form.mobile && selectedDate && selectedTime

  const handleBook = async () => {
    setSubmitError("")
    if (!isSignedIn) {
      setSubmitError("Please sign in to book an appointment.")
      return
    }
    if (!isValid) {
      setSubmitError("Please fill in your details and pick a date/time.")
      return
    }
    setSubmitting(true)
    try {
      const token = await getToken()
      const res = await api.post("/appointments", {
        doctorId: doctor._id || id,
        patientName: form.patientName,
        mobile: form.mobile,
        age: form.age,
        gender: form.gender,
        email: form.email,
        date: selectedDate,
        time: selectedTime,
        fee: doctor.fee,
        paymentMethod,
      }, { token })

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      } else {
        navigate("/my-appointments", { state: { booked: true } })
      }
    } catch (err) {
      setSubmitError(err.message || "Could not book appointment")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className={ds.loadingContainer}>Loading doctor profile...</div>
  }

  if (error || !doctor) {
    return (
      <div className={ds.errorContainer}>
        <div className={ds.errorContent}>
          <p className={ds.errorText}>{error || "Doctor not found"}</p>
          <Link to="/doctors" className={ds.backButton}>
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={ds.pageContainer}>
      <div className={ds.headerContainer}>
        <div className={ds.headerContent}>
          <div className={ds.headerFlex}>
            <Link to="/doctors" className={ds.headerBackButton}>
              <ArrowLeft className="w-[18px] h-[18px]" />
              <span className={ds.headerBackButtonText}>Back</span>
            </Link>
            <h1 className={ds.headerTitle}>{doctor.name}</h1>
            <div className={ds.headerRatingContainer}>
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className={ds.headerRatingText}>{doctor.rating || "New"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={ds.mainContent}>
        <div className={ds.profileCard}>
          <div className={ds.profileGrid}>
            <div className={ds.leftColumn}>
              <div className={ds.avatarContainer}>
                <div className={ds.avatarGlow} />
                {doctor.imageUrl ? (
                  <img src={doctor.imageUrl} alt={doctor.name} className={ds.avatarImage} />
                ) : (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-emerald-50 border-4 border-white shadow-2xl z-10 flex items-center justify-center text-emerald-300">
                    <Users className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className={ds.statsGrid}>
                <div className={ds.statBox}>
                  <Heart className={`${ds.statIcon} ${ds.heartIcon}`} />
                  <p className={ds.statValue}>{doctor.appointmentsCompleted ?? doctor.completed ?? 0}</p>
                  <p className={ds.statLabel}>Treated</p>
                </div>
                <div className={ds.statBox}>
                  <Award className={`${ds.statIcon} ${ds.awardIcon}`} />
                  <p className={ds.statValue}>{doctor.experience || "New"}</p>
                  <p className={ds.statLabel}>Experience</p>
                </div>
                <div className={ds.statBox}>
                  <Users className={`${ds.statIcon} ${ds.usersIcon}`} />
                  <p className={ds.statValue}>{doctor.patients || "0"}</p>
                  <p className={ds.statLabel}>Patients</p>
                </div>
              </div>
            </div>

            <div className={ds.rightColumn}>
              <h2 className={ds.doctorName}>{doctor.name}</h2>
              <span className={ds.specializationBadge}>
                <Award className={ds.badgeIcon} /> {doctor.specialization}
              </span>

              <div className={ds.infoGrid}>
                <div className={ds.infoItem}>
                  <GraduationCap className={ds.infoIcon} />
                  <div>
                    <p className={ds.infoLabel}>Qualifications</p>
                    <p className={ds.infoValue}>{doctor.qualifications || "N/A"}</p>
                  </div>
                </div>
                <div className={ds.infoItem}>
                  <MapPin className={ds.infoIcon} />
                  <div>
                    <p className={ds.infoLabel}>Location</p>
                    <p className={ds.infoValue}>{doctor.location || "N/A"}</p>
                  </div>
                </div>
                <div className={ds.infoItem}>
                  <Wallet className={ds.infoIcon} />
                  <div>
                    <p className={ds.infoLabel}>Consultation Fee</p>
                    <p className={ds.feeValue}>₹{doctor.fee}</p>
                  </div>
                </div>
              </div>

              {doctor.about && (
                <div className={ds.aboutContainer}>
                  <div className={ds.aboutHeader}>
                    <Info className={ds.aboutIcon} />
                    <h3 className={ds.aboutTitle}>About</h3>
                  </div>
                  <p className={ds.aboutText}>{doctor.about}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking */}
        <div className={ds.appointmentContainer}>
          <div className={ds.appointmentContent}>
            <div className={ds.appointmentHeader}>
              <CalendarDays className={ds.appointmentIcon} />
              <h3 className={ds.appointmentTitle}>Book an Appointment</h3>
            </div>

            <div className={ds.appointmentGrid}>
              <div className={ds.dateSection}>
                <h4 className={ds.dateTitle}>
                  <CalendarDays className={ds.dateTitleIcon} /> Select Date
                </h4>
                <div className={ds.dateScrollContainer}>
                  <div className={ds.dateButtonsContainer}>
                    {dates.length === 0 && <p className="text-gray-500 text-sm">No dates available.</p>}
                    {dates.map((d) => {
                      const label = formatDateLabel(d)
                      const selected = d === selectedDate
                      return (
                        <button
                          key={d}
                          onClick={() => { setSelectedDate(d); setSelectedTime("") }}
                          className={`${ds.dateButton} ${selected ? ds.dateButtonSelected : ds.dateButtonUnselected}`}
                        >
                          <div className={ds.dateContent}>
                            <p className={ds.dateWeekday}>{label.weekday}</p>
                            <p className={ds.dateDay}>{label.day}</p>
                            <p className={ds.dateMonth}>{label.month}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className={ds.patientForm}>
                  <h4 className={ds.patientFormTitle}>Your Details</h4>
                  <div className={ds.patientFormGrid}>
                    <input className={ds.formInput} placeholder="Full name"
                      value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
                    <input className={ds.formInput} placeholder="Mobile number"
                      value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                    <input className={ds.formInput} placeholder="Age" type="number"
                      value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                    <select className={ds.formSelect} value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input className={ds.emailInput} placeholder="Email (optional, for receipts)"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className={ds.timeSlotsSection}>
                <h4 className={ds.timeSlotsTitle}>
                  <Clock className={ds.timeSlotsIcon} /> Select Time
                </h4>
                <div className={ds.timeSlotsContainer}>
                  {slots.length === 0 && <p className={ds.noSlotsMessage}>No slots for this date.</p>}
                  {slots.map((t) => {
                    const selected = t === selectedTime
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`${ds.timeSlotButton} ${selected ? ds.timeSlotButtonSelected : ds.timeSlotButtonUnselected}`}
                      >
                        <span className={ds.timeSlotContent}>
                          <Clock className={ds.timeSlotIcon} /> {t}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className={ds.summaryContainer}>
                  <div className={ds.summaryItem}>
                    <div className={ds.summaryRow}>
                      <span className={ds.summaryLabel}>Date</span>
                      <span className={ds.summaryValue}>{selectedDate || "—"}</span>
                    </div>
                    <div className={ds.summaryRow}>
                      <span className={ds.summaryLabel}>Time</span>
                      <span className={ds.summaryValue}>{selectedTime || "—"}</span>
                    </div>
                    <div className={ds.summaryRow}>
                      <span className={ds.summaryLabel}>Fee</span>
                      <span className={ds.feeDisplay}>₹{doctor.fee}</span>
                    </div>
                  </div>

                  <div className={ds.paymentContainer}>
                    <span className={ds.paymentLabel}>Payment</span>
                    <div className={ds.paymentOptions}>
                      {["Cash", "Online"].map((m) => (
                        <span
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`${ds.paymentOption} ${paymentMethod === m ? ds.paymentOptionSelected : ds.paymentOptionUnselected}`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {submitError && <p className="text-rose-600 text-sm mb-2">{submitError}</p>}

                  {isSignedIn ? (
                    <button
                      disabled={!isValid || submitting}
                      onClick={handleBook}
                      className={`${ds.bookingButton} ${isValid && !submitting ? ds.bookingButtonEnabled : ds.bookingButtonDisabled}`}
                    >
                      <span className={ds.bookingButtonContent}>
                        {submitting ? <Loader2 className={`${ds.bookingIcon} animate-spin`} /> : <CheckCircle className={ds.bookingIcon} />}
                        {submitting ? "Booking..." : "Confirm Appointment"}
                      </span>
                    </button>
                  ) : (
                    <SignInButton mode="modal">
                      <button className={`${ds.bookingButton} ${ds.bookingButtonEnabled}`}>
                        Sign in to Book
                      </button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetail
