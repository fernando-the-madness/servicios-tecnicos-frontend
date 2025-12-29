import { useState } from 'react'
import axios from 'axios'

export default function PhotoUpload({ requestId }) {
  const [preview, setPreview] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      setPreview(reader.result)
      const res = await axios.post('http://localhost:5000/api/requests/upload-evidence', {
        data: reader.result
      })
      alert('Foto subida: ' + res.data.url)
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h5>Sube evidencia del trabajo</h5>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" width={200} />}
    </div>
  )
}