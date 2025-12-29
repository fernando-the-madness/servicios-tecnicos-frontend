// frontend/src/components/shared/AIRecommendations.jsx
export default function AIRecommendations({ user }) {
  const [suggestions] = useAI(user.id)
  return (
    <div>
      {suggestions.map(s => (
        <div key={s.id}>{s.service} - {s.confidence}%</div>
      ))}
    </div>
  )
}