import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getUser } from '../utils/auth'

export default function Login(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState(null)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault(); setErr(null);
    try{
      const r = await login(username,password);
      if (r && r.success) { nav('/'); return }
      setErr(r.message || 'Error');
    }catch(e){ setErr('Credenciales inválidas') }
  }

  if (getUser()) return <div className="container py-5">Ya autenticado. <a href="/">Ir al inicio</a></div>

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-3">Iniciar sesión</h3>
              {err && <div className="alert alert-danger">{err}</div>}
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input className="form-control" value={username} onChange={e=>setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
                </div>
                <div className="d-grid">
                  <button className="btn btn-primary" type="submit">Entrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
