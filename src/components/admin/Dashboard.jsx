// frontend/src/components/admin/Dashboard.jsx
import { Bar } from 'react-chartjs-2'

export default function AdminDashboard() {
  const data = {
    labels: ['Limpieza', 'Plomería', 'Electricidad'],
    datasets: [{ label: 'Servicios', data: [45, 23, 67], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }]
  }
  return <Bar data={data} />
}