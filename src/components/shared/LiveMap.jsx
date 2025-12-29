import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

const mapContainerStyle = { width: '100%', height: '400px' }
const center = { lat: 19.043, lng: -98.198 } // Puebla, México (ejemplo)

export default function LiveMap({ technicianLocation, estimatedTime }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyALleKKrJixJQUGS_jMfaltV2_gJQioOTQ' // ← pon tu key
  })

  if (!isLoaded) return <div>Cargando mapa...</div>

  return (
    <div>
      <h4>Ubicación del técnico</h4>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={technicianLocation || center}>
        {technicianLocation && <Marker position={technicianLocation} />}
      </GoogleMap>
      {estimatedTime && <p>Tiempo estimado: {estimatedTime} min</p>}
    </div>
  )
}