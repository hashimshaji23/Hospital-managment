import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './Pages/Login'
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

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      <Route element={<ProtectedRoute />}>
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

      <Route path='/' element={<Navigate to='/dashboard' replace />} />
      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  )
}

export default App
