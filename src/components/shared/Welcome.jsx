// frontend/src/components/shared/Welcome.jsx
export default function Welcome({ user }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', background: '#f0f4f8' }}>
      <h1>¡Bienvenido, {user.name}! 🎉</h1>
      <p>Tu primer servicio está a un clic de distancia.</p>
      <button onClick={() => window.location.href='/cliente'} style={{ padding: '16px 32px', background: '#667eea', color: 'white', border: 'none', borderRadius: 8 }}>
        Explorar servicios
      </button>
    </div>
  )
}