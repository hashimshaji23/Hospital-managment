import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { api } from '../utils/api'

const AppointmentSuccess = ({ service = false }) => {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")
  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!sessionId) { setStatus("error"); setMessage("Missing session id."); return }
    const path = service ? "/service-appointments/confirm" : "/appointments/confirm"
    api.get(`${path}?session_id=${sessionId}`)
      .then(() => { setStatus("success"); setMessage("Your payment was confirmed and the appointment is booked.") })
      .catch((err) => { setStatus("error"); setMessage(err.message || "Could not confirm payment.") })
  }, [sessionId, service])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
        {status === "loading" && <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />}
        {status === "success" && <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />}
        {status === "error" && <XCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />}

        <h1 className="text-2xl font-bold text-emerald-900 mb-2">
          {status === "loading" ? "Confirming payment..." : status === "success" ? "Payment Confirmed" : "Confirmation Failed"}
        </h1>
        <p className="text-gray-600 mb-6">{message || "Please wait..."}</p>

        <Link to="/my-appointments" className="inline-flex px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold">
          View My Appointments
        </Link>
      </div>
    </div>
  )
}

export default AppointmentSuccess
