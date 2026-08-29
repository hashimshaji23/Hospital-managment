import React from 'react'
import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

const AppointmentCancel = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
      <XCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-emerald-900 mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-6">Your payment was not completed. No appointment has been booked.</p>
      <Link to="/doctors" className="inline-flex px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold">
        Back to Doctors
      </Link>
    </div>
  </div>
)

export default AppointmentCancel
