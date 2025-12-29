export default function IncomingRequests({ requests, onAccept }) {
  if (requests.length === 0) return <p>No hay nuevas solicitudes.</p>

  return (
    <div>
      <h3>Solicitudes entrantes</h3>
      {requests.map((req) => (
        <div key={req.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
          <strong>{req.service}</strong> - {req.status} <br />
          Cliente: {req.clientName} <br />
          {req.description} <br />
          <small>{req.createdAt}</small> <br />
          <button onClick={() => onAccept(req)}>Aceptar</button>
        </div>
      ))}
    </div>
  )
}