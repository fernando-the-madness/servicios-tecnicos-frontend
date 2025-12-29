import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRoute from './components/common/PrivateRoute'
import ClientDashboard from './components/client/ClientDashboard.jsx'
import TechnicianDashboard from './components/technician/TechnicianDashboard.jsx'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cliente"
          element={
            <PrivateRoute role="cliente">
              <ClientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tecnico"
          element={
            <PrivateRoute role="tecnico">
              <TechnicianDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App