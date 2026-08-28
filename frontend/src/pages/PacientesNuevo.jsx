import React, { useState } from 'react'
import API from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function PacientesNuevo(){
  const [form,setForm]=useState({ tipo_documento:'DNI', numero_documento:'', nombres:'', apellidos:'', fecha_nacimiento:'', genero:'', telefono:'', email:'' })
  const [msg,setMsg]=useState(null)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/api/pacientes', form);
      setMsg('Paciente creado');
      setTimeout(()=>nav('/pacientes'),800)
    }catch(err){ setMsg('Error: '+(err.response&&err.response.data&&err.response.data.message||err.message)) }
  }

  return (
    <div className="container py-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-3">Nuevo Paciente</h3>
          {msg && <div className="alert alert-info">{msg}</div>}
          <form onSubmit={submit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Documento</label>
                <input className="form-control" value={form.numero_documento} onChange={e=>setForm({...form, numero_documento:e.target.value})} required/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Nombres</label>
                <input className="form-control" value={form.nombres} onChange={e=>setForm({...form, nombres:e.target.value})} required/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Apellidos</label>
                <input className="form-control" value={form.apellidos} onChange={e=>setForm({...form, apellidos:e.target.value})} required/>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary">Crear paciente</button>
              <button type="button" className="btn btn-outline-secondary" onClick={()=>window.history.back()}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
