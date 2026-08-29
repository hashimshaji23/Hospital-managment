import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import PublicLayout from './components/PublicLayout'
import ProtectedDoctorRoute from './components/doctor/ProtectedDoctorRoute'

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import DoctorDetail from './pages/DoctorDetail'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import MyAppointments from './pages/MyAppointments'
import Contact from './pages/Contact'
import AppointmentSuccess from './pages/AppointmentSuccess'
import AppointmentCancel from './pages/AppointmentCancel'

import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

const App = () => {
  return (
    <Routes>
      {/* Public site (with Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:id' element={<DoctorDetail />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services/:id' element={<ServiceDetail />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/contact' element={<Contact />} />

        <Route path='/appointment/success' element={<AppointmentSuccess service={false} />} />
        <Route path='/appointment/cancel' element={<AppointmentCancel />} />
        <Route path='/service-appointment/success' element={<AppointmentSuccess service={true} />} />
        <Route path='/service-appointment/cancel' element={<AppointmentCancel />} />
      </Route>

      {/* Doctor portal (own navbar, no site Navbar/Footer) */}
      <Route path='/doctor-login' element={<DoctorLogin />} />
      <Route path='/doctor/dashboard' element={
        <ProtectedDoctorRoute><DoctorDashboard /></ProtectedDoctorRoute>
      } />
      <Route path='/doctor/appointments' element={
        <ProtectedDoctorRoute><DoctorAppointments /></ProtectedDoctorRoute>
      } />
      <Route path='/doctor/profile' element={
        <ProtectedDoctorRoute><DoctorProfile /></ProtectedDoctorRoute>
      } />

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App
