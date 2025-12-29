import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('cliente')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://optimistic-caring-production.up.railway.app/api/auth/register', {
        name,
        email,
        password,
        role
      })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate(user.role === 'tecnico' ? '/tecnico' : '/cliente')
    } catch (err) {
      alert('Error al registrar')
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required /><br />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="tecnico">Técnico</option>
        </select><br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  )
}