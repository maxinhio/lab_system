import React, { useEffect, useState } from 'react'
import API from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function OrdenesNuevo(){
  const [pacientes,setPacientes]=useState([])
  const [examenes,setExamenes]=useState([])
  const [selectedPaciente,setSelectedPaciente]=useState('')
  const [selectedExamenes,setSelectedExamenes]=useState([])
  const [metodoPago,setMetodoPago]=useState('Efectivo')
  const [msg,setMsg]=useState(null)
  const nav = useNavigate()

  useEffect(()=>{ API.get('/api/pacientes').then(r=>setPacientes(r.data.data||[])).catch(()=>{}); API.get('/api/examenes').then(r=>setExamenes(r.data.data||[])).catch(()=>{}); },[])

  function toggleEx(id){ setSelectedExamenes(s => s.includes(id)? s.filter(x=>x!==id): [...s,id]) }

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/api/ordenes', { id_paciente: selectedPaciente, examenes: selectedExamenes, metodo_pago: metodoPago });
      setMsg('Orden creada');
      setTimeout(()=>nav('/ordenes'),800)
    }catch(err){ setMsg('Error: '+(err.response&&err.response.data&&err.response.data.message||err.message)) }
  }

  return (
    <div className="container py-3">
      <div className="card">
        <div className="card-body">
          <h3>Nueva Orden</h3>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Paciente</label>
              <select className="form-select" value={selectedPaciente} onChange={e=>setSelectedPaciente(e.target.value)} required>
                <option value="">-- seleccionar --</option>
                {pacientes.map(p=> <option key={p.id_paciente} value={p.id_paciente}>{p.numero_documento} - {p.nombres} {p.apellidos}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <h5>Seleccionar exámenes</h5>
              <div className="row">
                {examenes.map(ex=> (
                  <div className="col-md-4" key={ex.id_examen}>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id={`ex-${ex.id_examen}`} checked={selectedExamenes.includes(ex.id_examen)} onChange={()=>toggleEx(ex.id_examen)} />
                      <label className="form-check-label" htmlFor={`ex-${ex.id_examen}`}>{ex.nombre_examen} <small className="text-muted">({ex.precio})</small></label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Método de pago</label>
              <select className="form-select" value={metodoPago} onChange={e=>setMetodoPago(e.target.value)}>
                <option>Efectivo</option>
                <option>QR</option>
                <option>Transferencia</option>
                <option>Tarjeta</option>
              </select>
            </div>
            <div className="d-grid"><button className="btn btn-primary" type="submit">Confirmar y Crear Orden</button></div>
          </form>
        </div>
      </div>
    </div>
  )
}
