import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { serviceDetailStyles as ds } from '../assets/dummyStyles'
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { api } from '../utils/api'

const ServiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Online")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")

  const [form, setForm] = useState({ patientName: "", mobile: "", age: "", gender: "", email: "" })

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get(`/services/${id}`)
      .then((res) => { if (active) setService(res.data || res.service) })
      .catch((err) => { if (active) setError(err.message || "Service not found") })
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

  const dates = useMemo(() => service?.dates || [], [service])
  useEffect(() => { if (dates.length && !selectedDate) setSelectedDate(dates[0]) }, [dates, selectedDate])

  const slots = service?.slots?.[selectedDate] || []

  const isValid = form.patientName && form.mobile && selectedDate && selectedTime

  const handleBook = async () => {
    setSubmitError("")
    if (!isSignedIn) { setSubmitError("Please sign in to book."); return }
    if (!isValid) { setSubmitError("Please fill your details and pick a date/time."); return }
    setSubmitting(true)
    try {
      const token = await getToken()
      const res = await api.post("/service-appointments", {
        serviceId: service._id,
        serviceName: service.name,
        patientName: form.patientName,
        mobile: form.mobile,
        age: form.age,
        gender: form.gender,
        email: form.email,
        date: selectedDate,
        time: selectedTime,
        amount: service.price,
        paymentMethod,
      }, { token })

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      } else {
        setSubmitSuccess("Appointment booked! Redirecting...")
        setTimeout(() => navigate("/my-appointments"), 1200)
      }
    } catch (err) {
      setSubmitError(err.message || "Could not book appointment")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-600 mb-3">{error || "Service not found"}</p>
          <Link to="/services" className={ds.backButton}><ArrowLeft className="w-4 h-4" /> Back to Services</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={ds.pageContainer}>
      <div className={ds.navBar}>
        <div className={ds.navContainer}>
          <Link to="/services" className={ds.backButton}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      <div className={ds.mainGrid}>
        <div className={ds.leftColumn}>
          <div className={ds.imageContainer}>
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.name} className={ds.image} />
            ) : (
              <div className="w-full h-full bg-emerald-50" />
            )}
          </div>

          <div className={ds.detailsContainer}>
            <h3 className={ds.detailsTitle}>Your Details</h3>
            <div className={ds.detailsGrid}>
              <input className={ds.input} placeholder="Full name"
                value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
              <input className={ds.input} placeholder="Mobile number"
                value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <input className={ds.input} placeholder="Age" type="number"
                value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <select className={ds.input} value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input className={ds.emailInput} placeholder="Email (optional)"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="mt-4">
              <span className={ds.paymentLabel}>Payment Method</span>
              <div className={ds.paymentOptions}>
                {["Online", "Cash"].map((m) => (
                  <span key={m} onClick={() => setPaymentMethod(m)} className={ds.paymentOption(paymentMethod === m)}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className={ds.dateSection}>
              <h4 className={ds.dateTitle}>Select Date</h4>
              <div className={ds.dateScrollContainer}>
                <div className={ds.dateButtonsContainer}>
                  {dates.length === 0 && <p className="text-gray-500 text-sm">No dates available.</p>}
                  {dates.map((d) => (
                    <span key={d} onClick={() => { setSelectedDate(d); setSelectedTime("") }} className={ds.dateButton(d === selectedDate)}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={ds.timeSection}>
              <h4 className={ds.timeTitle}>Select Time</h4>
              <div className={ds.timeScrollContainer}>
                <div className={ds.timeButtonsContainer}>
                  {slots.length === 0 && <p className={ds.noSlotsMessage}>No slots for this date.</p>}
                  {slots.map((t) => (
                    <span key={t} onClick={() => setSelectedTime(t)} className={ds.timeButton(t === selectedTime)}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {submitError && <p className={ds.errorMessage}>{submitError}</p>}
            {submitSuccess && <p className={ds.successMessage}>{submitSuccess}</p>}

            {isSignedIn ? (
              <button disabled={!isValid || submitting} onClick={handleBook} className={ds.submitButton(isValid, submitting)}>
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className={ds.submitButton(true, false)}>Sign in to Book</button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className={ds.rightColumn}>
          <h2 className={ds.serviceName}>{service.name}</h2>

          {service.about && (
            <div className={ds.aboutContainer}>
              <h3 className={ds.aboutTitle}>About this service</h3>
              <p className={ds.aboutText}>{service.about}</p>
            </div>
          )}

          <div className={ds.priceContainer}>
            <span className={ds.priceText}>₹{service.price}</span>
          </div>

          {!!(service.instructions || []).length && (
            <div className={ds.instructionsContainer}>
              <h3 className={ds.instructionsTitle}>Instructions</h3>
              <ul className={ds.instructionsList}>
                {service.instructions.map((ins, i) => <li key={i}>{ins}</li>)}
              </ul>
            </div>
          )}

          <div className={ds.summaryContainer}>
            <h4 className={ds.summaryTitle}>Booking Summary</h4>
            <div className={ds.summaryContent}>
              <div>Date: {selectedDate || "—"}</div>
              <div>Time: {selectedTime || "—"}</div>
              <div>Amount: ₹{service.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail
