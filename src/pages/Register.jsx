import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    alert('Registrado (falta backend)')
    navigate('/')
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required /><br />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  )
}