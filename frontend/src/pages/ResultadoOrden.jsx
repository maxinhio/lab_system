import React, { useEffect, useState } from 'react'
import API from '../utils/auth'
import { useParams } from 'react-router-dom'

export default function ResultadoOrden(){
  const { ordenId } = useParams()
  const [data,setData]=useState(null)
  const [newRows,setNewRows]=useState([])
  const [saving,setSaving]=useState(false)
  useEffect(()=>{
    API.get('/api/resultados/orden/' + ordenId).then(r=> setData(r.data.data)).catch(()=>{})
  },[ordenId])

  function addRow(){ setNewRows([...newRows, { nombre_parametro:'', valor_hallado:'', unidad_medida:'', id_muestra: (data && data.muestras && data.muestras[0])?data.muestras[0].id_muestra:null }]) }

  async function save(){
    if (newRows.length===0) return;
    setSaving(true)
    try{ await API.post('/api/resultados', newRows); alert('Guardado'); window.location.reload() }catch(e){ alert('Error') } finally{ setSaving(false) }
  }

  function autorizar(id){ API.put('/api/resultados/'+id, { autorizado: true }).then(()=> window.location.reload()).catch(()=> alert('Error')) }
  function autorizarOrden(){ API.post('/api/ordenes/' + ordenId + '/autorizar').then(()=>{ alert('Orden autorizada'); window.location.reload() }).catch(e=> alert('Error al autorizar')) }
  function generarPdf(){ window.open('/api/reportes/' + ordenId + '/pdf', '_blank') }

  if(!data) return <div className="container py-3">Cargando...</div>
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 className="mb-1">Resultados - Orden {data.orden.id_orden}</h3>
          <div className="text-muted">Paciente: {data.orden.nombres} {data.orden.apellidos}</div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={autorizarOrden}>Autorizar Orden</button>
          <button className="btn btn-primary" onClick={generarPdf}>Generar PDF</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="mb-2">Muestras</h6>
              <ul className="list-unstyled small mb-0">{data.muestras.map(m=> <li key={m.id_muestra} className="mb-1"><strong>{m.codigo_qr}</strong> • {m.tipo_muestra}</li>)}</ul>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h6 className="mb-2">Exámenes</h6>
              <ul className="list-unstyled small mb-0">{data.detalle.map(d=> <li key={d.id_detalle} className="mb-1">{d.nombre_examen} <span className="text-muted">({d.precio_unitario})</span></li>)}</ul>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-body table-responsive">
              <h6>Resultados existentes</h6>
              <table className="table table-hover align-middle">
                <thead><tr><th>ID</th><th>Muestra</th><th>Parámetro</th><th>Valor</th><th>Unidad</th><th>Autorizado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {data.resultados.map(r=> (
                    <tr key={r.id_resultado}>
                      <td>{r.id_resultado}</td>
                      <td><code className="text-muted">{r.codigo_qr}</code></td>
                      <td>{r.nombre_parametro}</td>
                      <td>{r.valor_hallado}</td>
                      <td>{r.unidad_medida}</td>
                      <td>{r.autorizado? <span className="badge bg-success">Sí</span> : <span className="badge bg-secondary">No</span>}</td>
                      <td><button className="btn btn-sm btn-outline-primary" onClick={()=>autorizar(r.id_resultado)}>Autorizar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6>Agregar resultados</h6>
              <button className="btn btn-sm btn-outline-secondary mb-2" onClick={addRow}>Agregar fila</button>
              <div>
                {newRows.map((nr,idx)=> (
                  <div key={idx} className="border rounded p-2 mb-2 bg-light">
                    <div className="mb-2">Muestra: <select className="form-select d-inline-block w-auto ms-2" value={nr.id_muestra} onChange={e=> { const v=e.target.value; const copy=[...newRows]; copy[idx].id_muestra=v; setNewRows(copy) }}>{data.muestras.map(m=> <option key={m.id_muestra} value={m.id_muestra}>{m.codigo_qr}</option>)}</select></div>
                    <div className="mb-2">Parámetro: <input className="form-control d-inline-block w-50 ms-2" value={nr.nombre_parametro} onChange={e=> { const copy=[...newRows]; copy[idx].nombre_parametro=e.target.value; setNewRows(copy) }} /></div>
                    <div className="mb-2">Valor: <input className="form-control d-inline-block w-25 ms-2" value={nr.valor_hallado} onChange={e=> { const copy=[...newRows]; copy[idx].valor_hallado=e.target.value; setNewRows(copy) }} /></div>
                    <div className="mb-2">Unidad: <input className="form-control d-inline-block w-25 ms-2" value={nr.unidad_medida} onChange={e=> { const copy=[...newRows]; copy[idx].unidad_medida=e.target.value; setNewRows(copy) }} /></div>
                  </div>
                ))}
              </div>
              <div><button className="btn btn-primary" disabled={saving} onClick={save}>Guardar</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
