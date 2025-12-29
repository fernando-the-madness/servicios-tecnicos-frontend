import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// frontend/src/components/shared/ChatBox.jsx
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')

export default function Chat({ requestId, userId, role }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    socket.emit('joinRoom', requestId)
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
      new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3').play()
    })
    return () => socket.off('message')
  }, [requestId])

  const sendMessage = () => {
    if (!text) return
    const msg = { text, sender: role, timestamp: new Date().toLocaleTimeString() }
    socket.emit('sendMessage', { roomId: requestId, msg })
    setMessages((prev) => [...prev, msg])
    setText('')
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 8, marginTop: 16 }}>
      <h5>Chat en vivo</h5>
      <div style={{ height: 120, overflowY: 'auto', background: '#f9f9f9', padding: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === role ? 'right' : 'left' }}>
            <small>{m.timestamp}</small> <strong>{m.sender}:</strong> {m.text}
          </div>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un mensaje"
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  )
}