import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { doctorTokenStore } from '../../utils/api'
import DoctorNavbar from './DoctorNavbar'

const ProtectedDoctorRoute = () => {
  const token = doctorTokenStore.get()
  if (!token) return <Navigate to="/doctor-login" replace />
  return (
    <>
      <DoctorNavbar />
      <Outlet />
    </>
  )
}

export default ProtectedDoctorRoute
