import React, { useEffect, useState } from 'react'
import API from '../utils/auth'
import { Link } from 'react-router-dom'

export default function Muestras(){
  const [muestras,setMuestras]=useState([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{ API.get('/api/muestras').then(r=>setMuestras(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false)) },[])
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Muestras</h2>
      </div>
      {loading? <div className="text-center">Cargando...</div> : (
        <div className="card">
          <div className="card-body table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>ID</th><th>Código QR</th><th>Orden</th><th>Paciente</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {muestras.map(m=> (
                  <tr key={m.id_muestra}>
                    <td>{m.id_muestra}</td>
                    <td><code className="text-muted">{m.codigo_qr}</code></td>
                    <td>{m.id_orden}</td>
                    <td>{m.nombres} {m.apellidos}</td>
                    <td>{m.tipo_muestra}</td>
                    <td><span className={m.estado_muestra==='RECEPCIONADA'? 'badge bg-info':'badge bg-secondary'}>{m.estado_muestra}</span></td>
                    <td><Link className="btn btn-sm btn-outline-secondary" to={`/muestras/print/${m.codigo_qr}`} target="_blank">Imprimir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
