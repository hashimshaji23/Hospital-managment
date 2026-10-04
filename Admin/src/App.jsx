import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './Pages/Login'

// Admin Pages
import Dashboard from './Pages/Dashboard'
import AddDoctor from './Pages/AddDoctor'
import ListDoctors from './Pages/ListDoctors'
import EditDoctor from './Pages/EditDoctor'
import Appointments from './Pages/Appointments'
import ServiceDashboard from './Pages/ServiceDashboard'
import AddService from './Pages/AddService'
import ListServices from './Pages/ListServices'
import EditService from './Pages/EditService'
import ServiceAppointments from './Pages/ServiceAppointments'

// Doctor Pages
import DoctorDashboard from './Pages/doctor/DoctorDashboard'
import DoctorAppointments from './Pages/doctor/DoctorAppointments'
import DoctorProfile from './Pages/doctor/DoctorProfile'

const RootRedirect = () => {
  const { isAuthenticated, isDoctor, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isDoctor) return <Navigate to="/doctor/dashboard" replace />
  return <Navigate to="/dashboard" replace />
}

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      {/* Admin Specific Routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/add-doctor' element={<AddDoctor />} />
        <Route path='/list-doctors' element={<ListDoctors />} />
        <Route path='/doctors/:id/edit' element={<EditDoctor />} />
        <Route path='/appointments' element={<Appointments />} />
        <Route path='/service-dashboard' element={<ServiceDashboard />} />
        <Route path='/add-service' element={<AddService />} />
        <Route path='/list-services' element={<ListServices />} />
        <Route path='/services/:id/edit' element={<EditService />} />
        <Route path='/service-appointments' element={<ServiceAppointments />} />
      </Route>

      {/* Doctor Specific Routes */}
      <Route element={<ProtectedRoute role="doctor" />}>
        <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
        <Route path='/doctor/appointments' element={<DoctorAppointments />} />
        <Route path='/doctor/profile' element={<DoctorProfile />} />
      </Route>

      {/* Fallbacks */}
      <Route path='/' element={<RootRedirect />} />
      <Route path='*' element={<RootRedirect />} />
    </Routes>
  )
}

export default App
