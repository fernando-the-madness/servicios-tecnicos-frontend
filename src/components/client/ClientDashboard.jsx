import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Chat from '../shared/Chat.jsx'
import Rating from '../shared/Rating.jsx'

const socket = io('http://localhost:5000')

export default function ClientDashboard() {
  const [user, setUser] = useState(null)
  const [services] = useState([
    { name: 'Limpieza', icon: '🧹', color: '#10b981' },
    { name: 'Plomería', icon: '🔧', color: '#3b82f6' },
    { name: 'Electricidad', icon: '⚡', color: '#f59e0b' },
    { name: 'Pintura', icon: '🎨', color: '#8b5cf6' }
  ])
  const [selectedService, setSelectedService] = useState('')
  const [description, setDescription] = useState('')
  const [requests, setRequests] = useState([])
  const [technicianLocation, setTechnicianLocation] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))

    socket.emit('joinRoom', '123')
    socket.on('notificacionAceptado', (data) => {
      setNotification(data.msg)
      setRequests(prev => prev.map(r => r.id === '123' ? { ...r, status: data.status } : r))
    })

    setTimeout(() => {
      setTechnicianLocation({ lat: 19.043, lng: -98.198 })
      setEstimatedTime(15)
    }, 5000)
  }, [])

  const handleRequest = () => {
    if (!selectedService || !description) return alert('Completa todos los campos')
    const newRequest = {
      id: '123',
      service: selectedService,
      description,
      status: 'pendiente',
      createdAt: new Date().toLocaleString()
    }
    setRequests([newRequest])
    setDescription('')
    setSelectedService('')
    setNotification('¡Solicitud enviada! Un técnico la verá en tiempo real.')
  }

  const handleRating = (rating) => {
    alert(`¡Gracias por calificar con ${rating.stars} estrellas!`)
    setShowRating(false)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: { text: 'Pendiente', color: '#fbbf24', emoji: '⏳' },
      'en camino': { text: 'En camino', color: '#3b82f6', emoji: '🚗' },
      'en proceso': { text: 'En proceso', color: '#8b5cf6', emoji: '🔧' },
      finalizado: { text: 'Finalizado', color: '#10b981', emoji: '✅' }
    }
    const badge = badges[status] || badges.pendiente
    return (
      <span style={{
        background: badge.color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {badge.emoji} {badge.text}
      </span>
    )
  }

  if (!user) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Cargando...</h2>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937' }}>¡Hola, {user.name}! 👋</h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Cliente</p>
        </div>
        <button onClick={() => {
          localStorage.clear()
          window.location.href = '/'
        }} style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          🚪 Salir
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          background: '#10b981',
          color: 'white',
          padding: '16px',
          textAlign: 'center',
          animation: 'slideDown 0.3s ease-out'
        }}>
          ✅ {notification}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Service Request Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>⚡ Solicitar Servicio</h3>
          
          {/* Service Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {services.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedService(s.name)}
                style={{
                  background: selectedService === s.name ? s.color : '#f3f4f6',
                  color: selectedService === s.name ? 'white' : '#4b5563',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  transform: selectedService === s.name ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div>{s.icon}</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>{s.name}</div>
              </button>
            ))}
          </div>

          {/* Description */}
          <textarea
            placeholder="Describe detalladamente tu problema..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none',
              marginBottom: '16px'
            }}
          />

          {/* Submit Button */}
          <button onClick={handleRequest} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            width: '100%',
            transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
             onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
            🚀 Solicitar Ahora
          </button>
        </div>

        {/* Active Requests */}
        {requests.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>📋 Solicitudes Activas</h3>
            {requests.map((r) => (
              <div key={r.id} style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '18px' }}>{r.service}</strong>
                  {getStatusBadge(r.status)}
                </div>
                <p style={{ margin: '8px 0', color: '#6b7280' }}>{r.description}</p>
                <small style={{ color: '#9ca3af' }}>📅 {r.createdAt}</small>
              </div>
            ))}
          </div>
        )}

        {/* Map & Time */}
        {technicianLocation && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🗺️ Ubicación del Técnico</h3>
            <div style={{
              background: '#3b82f6',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              🚗 Llegará en {estimatedTime} minutos
            </div>
            <iframe
              title="mapa"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0, borderRadius: '12px' }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zFqtW0y6k4dN6Wc5FzFqF5F5&q=${technicianLocation.lat},${technicianLocation.lng}&zoom=15`}
              allowFullScreen
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={() => setShowChat(!showChat)} style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            💬 {showChat ? 'Cerrar' : 'Abrir'} Chat
          </button>
          <button onClick={() => setShowRating(true)} style={{
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            ⭐ Calificar
          </button>
        </div>

        {/* Chat Float */}
        {showChat && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            maxHeight: '500px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <strong>💬 Chat en vivo</strong>
              <button onClick={() => setShowChat(false)} style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}>×</button>
            </div>
            <Chat requestId="123" userId={user.id} role="cliente" />
          </div>
        )}

        {/* Rating Modal */}
        {showRating && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{ margin: '0 0 16px 0' }}>⭐ Califica el Servicio</h3>
              <Rating onSubmit={handleRating} />
              <button onClick={() => setShowRating(false)} style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '12px'
              }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}