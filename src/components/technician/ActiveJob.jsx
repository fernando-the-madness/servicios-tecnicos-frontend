export default function ActiveJob({ request, onFinish }) {
  if (!request) return <p>No hay trabajo activo.</p>

  return (
    <div>
      <h3>Trabajo activo</h3>
      <p><strong>Servicio:</strong> {request.service}</p>
      <p><strong>Cliente:</strong> {request.clientName}</p>
      <p><strong>Estado:</strong> {request.status}</p>

      {/* Mapa con ruta */}
      <iframe
        title="ruta"
        width="100%"
        height="300"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zFqtW0y6k4dN6Wc5FzFqF5F5&origin=19.043,-98.198&destination=${request.location.lat},${request.location.lng}`}
        allowFullScreen
      />

      <button onClick={onFinish}>Finalizar trabajo</button>
    </div>
  )
}