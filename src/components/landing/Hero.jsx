// frontend/src/components/auth/MagicRegister.jsx
import { GoogleLogin } from '@react-oauth/google'

export default function MagicRegister() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Regístrate en 5 segundos</h2>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          // Decodificar token y registrar usuario
          const user = JSON.parse(atob(credentialResponse.credential))
          localStorage.setItem('user', JSON.stringify(user))
          window.location.href = '/cliente'
        }}
        onError={() => alert('Error al registrar con Google')}
      />
      <p style={{ marginTop: 16 }}>También puedes registrar con email</p>
      <button onClick={() => window.location.href='/register'} style={{ padding: '12px 24px', background: '#4285F4', color: 'white', border: 'none', borderRadius: 8 }}>
        Registrar con email
      </button>
    </div>
  )
}