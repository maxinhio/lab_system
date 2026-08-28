import React, { useEffect, useState } from 'react'
import API from '../utils/auth'
import { Link } from 'react-router-dom'

export default function Resultados(){
  const [ordenes,setOrdenes]=useState([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{ API.get('/api/ordenes').then(r=>setOrdenes(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false)) },[])
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Resultados - Órdenes</h2>
      </div>
      {loading? <div className="text-center">Cargando...</div> : (
        <div className="card">
          <div className="card-body table-responsive mt-3">
            <table className="table table-hover align-middle">
              <thead><tr><th>ID</th><th>Paciente</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {ordenes.map(o=> (
                  <tr key={o.id_orden}>
                    <td>{o.id_orden}</td>
                    <td>{o.nombres} {o.apellidos}</td>
                    <td>{o.monto_total}</td>
                    <td><span className={o.estado_orden==='COMPLETADA'? 'badge bg-success':'badge bg-secondary'}>{o.estado_orden}</span></td>
                    <td><Link className="btn btn-sm btn-outline-primary" to={`/resultados/${o.id_orden}`}>Abrir</Link></td>
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
