import { useState } from 'react'

export default function Rating({ onSubmit }) {
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    onSubmit({ stars, comment })
  }

  return (
    <div style={{ padding: 16, border: '1px solid #ccc' }}>
      <h5>¿Cómo estuvo el servicio?</h5>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => setStars(s)}
          style={{ cursor: 'pointer', fontSize: 24, color: s <= stars ? 'gold' : 'gray' }}
        >
          ★
        </span>
      ))}
      <br />
      <textarea
        placeholder="Comentario (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={handleSubmit}>Enviar calificación</button>
    </div>
  )
}