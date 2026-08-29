import React from 'react'
import { Navigate } from 'react-router-dom'
import { doctorTokenStore } from '../../utils/api'
import DoctorNavbar from './DoctorNavbar'

const ProtectedDoctorRoute = ({ children }) => {
  const token = doctorTokenStore.get()
  if (!token) return <Navigate to="/doctor-login" replace />
  return (
    <>
      <DoctorNavbar />
      {children}
    </>
  )
}

export default ProtectedDoctorRoute
