// frontend/src/components/shared/PushNotification.jsx
import { useEffect } from 'react'

export default function PushNotification() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('¡Técnico en camino!', { body: 'Pedro está a 5 min' })
    }
  }, [])
  return null
}
