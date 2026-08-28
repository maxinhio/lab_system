import React, { useEffect, useState } from 'react'
import API from '../utils/auth'

export default function Dashboard(){
  const [stats,setStats]=useState({});
  const [loading,setLoading]=useState(true)
  const [err,setErr]=useState(null)
  useEffect(()=>{
    async function load(){
      try{
        const [p,o,m] = await Promise.all([
          API.get('/api/pacientes'),
          API.get('/api/ordenes'),
          API.get('/api/muestras')
        ]);
        const pacientes = p.data.data.length;
        const ordenes = o.data.data.length;
        const muestras = m.data.data.length;
        const completadas = o.data.data.filter(x=>x.estado_orden==='COMPLETADA').length;
        const ingresos = o.data.data.reduce((s,x)=> s + parseFloat(x.monto_total||0),0);
        setStats({ pacientes, ordenes, muestras, completadas, ingresos });
      }catch(e){ setErr('Error cargando estadísticas') }
      setLoading(false)
    }
    load()
  },[])

  if (loading) return <div className="container py-3">Cargando...</div>
  if (err) return <div className="container py-3 text-danger">{err}</div>
  return (
    <div className="container py-3">
      <h2>Dashboard</h2>
      <div className="row mt-3 g-3">
        <div className="col-sm-6 col-md-2"><div className="card text-center p-3"><div>Pacientes</div><div className="h4 mt-2">{stats.pacientes}</div></div></div>
        <div className="col-sm-6 col-md-2"><div className="card text-center p-3"><div>Órdenes</div><div className="h4 mt-2">{stats.ordenes}</div></div></div>
        <div className="col-sm-6 col-md-2"><div className="card text-center p-3"><div>Muestras</div><div className="h4 mt-2">{stats.muestras}</div></div></div>
        <div className="col-sm-6 col-md-2"><div className="card text-center p-3"><div>Completadas</div><div className="h4 mt-2">{stats.completadas}</div></div></div>
        <div className="col-sm-12 col-md-4"><div className="card text-center p-3"><div>Ingresos</div><div className="h4 mt-2">{stats.ingresos.toFixed(2)}</div></div></div>
      </div>
    </div>
  )
}
