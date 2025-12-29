import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Chat from '../shared/Chat.jsx'
import Rating from '../shared/Rating.jsx'

const socket = io('http://localhost:5000')

export default function TechnicianDashboard() {
  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [activeRequest, setActiveRequest] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored || JSON.parse(stored).role !== 'tecnico') {
      alert('Acceso denegado')
      navigate('/')
      return
    }
    setUser(JSON.parse(stored))

    setRequests([
      {
        id: '123',
        service: 'Plomería',
        description: 'Fuga en cocina',
        status: 'pendiente',
        clientName: 'Pedro',
        location: { lat: 19.043, lng: -98.198 },
        createdAt: new Date().toLocaleString(),
        priority: 'alta'
      },
      {
        id: '124',
        service: 'Electricidad',
        description: 'Corto circuito en sala',
        status: 'pendiente',
        clientName: 'María',
        location: { lat: 19.050, lng: -98.200 },
        createdAt: new Date().toLocaleString(),
        priority: 'urgente'
      }
    ])
  }, [navigate])

  const acceptRequest = (req) => {
    setActiveRequest({ ...req, status: 'en camino' })
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'en camino' } : r))

    socket.emit('tecnicoAcepto', {
      roomId: req.id,
      tecnicoName: user.name
    })
  }

  const startJob = () => {
    setActiveRequest({ ...activeRequest, status: 'en proceso' })
  }

  const finishRequest = () => {
    setActiveRequest({ ...activeRequest, status: 'finalizado' })
    setShowRating(true)
  }

  const getServiceIcon = (service) => {
    const icons = {
      'Limpieza': '🧹',
      'Plomería': '🔧',
      'Electricidad': '⚡',
      'Pintura': '🎨'
    }
    return icons[service] || '🔧'
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      normal: { text: 'Normal', color: '#10b981' },
      alta: { text: 'Alta', color: '#f59e0b' },
      urgente: { text: 'Urgente', color: '#ef4444' }
    }
    const badge = badges[priority] || badges.normal
    return (
      <span style={{
        background: badge.color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold'
      }}>
        🔥 {badge.text}
      </span>
    )
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

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter)

  if (!user) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Cargando...</h2>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
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
          <h2 style={{ margin: 0, color: '#1f2937' }}>🔧 Panel Técnico</h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{user.name}</p>
        </div>
        <button onClick={() => {
          localStorage.clear()
          navigate('/')
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

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {requests.filter(r => r.status === 'pendiente').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Pendientes</div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🚗</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {requests.filter(r => r.status === 'en camino').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>En Camino</div>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {requests.filter(r => r.status === 'finalizado').length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Completados</div>
          </div>
        </div>

        {/* Active Job */}
        {activeRequest && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '3px solid #3b82f6'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🚀 Trabajo Activo</h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {getServiceIcon(activeRequest.service)} {activeRequest.service}
                </div>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  Cliente: {activeRequest.clientName}
                </div>
              </div>
              {getStatusBadge(activeRequest.status)}
            </div>

            <p style={{ color: '#4b5563', marginBottom: '16px' }}>
              {activeRequest.description}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {activeRequest.status === 'en camino' && (
                <button onClick={startJob} style={{
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  🔧 Iniciar Trabajo
                </button>
              )}
              
              {activeRequest.status === 'en proceso' && (
                <button onClick={finishRequest} style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  ✅ Finalizar
                </button>
              )}
              
              <button onClick={() => setShowChat(!showChat)} style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                💬 Chat Cliente
              </button>
              
              <button style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                📍 Ver Mapa
              </button>
            </div>

            {/* Map */}
            <div style={{ marginTop: '16px' }}>
              <iframe
                title="mapa"
                width="100%"
                height="250"
                frameBorder="0"
                style={{ border: 0, borderRadius: '12px' }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zFqtW0y6k4dN6Wc5FzFqF5F5&q=${activeRequest.location.lat},${activeRequest.location.lng}&zoom=15`}
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Incoming Requests */}
        {!activeRequest && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>📥 Solicitudes Disponibles</h3>
              
              {/* Filter Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'pendiente', 'en camino'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      background: filter === f ? '#3b82f6' : '#e5e7eb',
                      color: filter === f ? 'white' : '#4b5563',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {f === 'all' ? 'Todas' : f}
                  </button>
                ))}
              </div>
            </div>

            {filteredRequests.length === 0 && (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                No hay solicitudes disponibles
              </p>
            )}

            {filteredRequests.map((req) => (
              <div key={req.id} style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                background: '#f9fafb',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                      {getServiceIcon(req.service)} {req.service}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      Cliente: {req.clientName}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {getPriorityBadge(req.priority)}
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                <p style={{ color: '#4b5563', marginBottom: '12px' }}>
                  {req.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <small style={{ color: '#9ca3af' }}>📅 {req.createdAt}</small>
                  
                  {req.status === 'pendiente' && (
                    <button onClick={() => acceptRequest(req)} style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                      ✅ Aceptar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Float */}
        {showChat && activeRequest && (
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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '16px 16px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <strong>💬 Chat con {activeRequest.clientName}</strong>
              <button onClick={() => setShowChat(false)} style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}>×</button>
            </div>
            <Chat requestId={activeRequest.id} userId={user.id} role="tecnico" />
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
              <h3 style={{ margin: '0 0 16px 0' }}>⭐ El cliente te calificó</h3>
              <Rating onSubmit={(r) => {
                alert(`Recibiste ${r.stars} estrellas`)
                setShowRating(false)
                setActiveRequest(null)
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}