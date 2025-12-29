export default function JobHistory({ requests }) {
  if (requests.length === 0) return <p>Aún no has finalizado trabajos.</p>

  return (
    <div>
      <h3>Historial de trabajos</h3>
      {requests.map((req) => (
        <div key={req.id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
          <strong>{req.service}</strong> - {req.status} <br />
          Cliente: {req.clientName} <br />
          {req.description} <br />
          <small>{req.createdAt}</small>
        </div>
      ))}
    </div>
  )
}