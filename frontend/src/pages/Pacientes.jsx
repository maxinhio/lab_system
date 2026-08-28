import React, { useEffect, useState } from 'react'
import API from '../utils/auth'
import { Link } from 'react-router-dom'

export default function Pacientes(){
  const [pacientes,setPacientes]=useState([])
  const [loading,setLoading]=useState(false)
  const [query,setQuery]=useState('')

  useEffect(()=>{ fetchAll() },[])
  function fetchAll(){
    setLoading(true)
    API.get('/api/pacientes').then(r=>{ setPacientes(r.data.data || []); }).catch(e=>{ console.error(e) }).finally(()=>setLoading(false))
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Pacientes</h2>
        <Link className="btn btn-primary" to="/pacientes/nuevo">+ Nuevo paciente</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input className="form-control" placeholder="Buscar por doc, nombre o apellido" value={query} onChange={e=>setQuery(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-outline-secondary" onClick={()=>fetchAll()}>Actualizar</button>
            </div>
          </div>
        </div>
      </div>

      {loading? <div className="text-center py-4">Cargando...</div> : (
        <div className="card">
          <div className="card-body table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>ID</th><th>Documento</th><th>Nombres</th><th>Apellidos</th><th>Acciones</th></tr></thead>
              <tbody>
                {pacientes.map(p=> (
                  <tr key={p.id_paciente}>
                    <td>{p.id_paciente}</td>
                    <td>{p.numero_documento}</td>
                    <td>{p.nombres}</td>
                    <td>{p.apellidos}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">Ver</button>
                      <button className="btn btn-sm btn-outline-secondary">Editar</button>
                    </td>
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
