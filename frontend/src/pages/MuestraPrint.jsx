import React, { useEffect, useState } from 'react'
import API from '../utils/auth'
import { useParams } from 'react-router-dom'

export default function MuestraPrint(){
  const { codigo } = useParams()
  const [muestra,setMuestra]=useState(null)
  const [qr,setQr]=useState(null)
  useEffect(()=>{
    API.get('/api/muestras/' + codigo).then(r=> setMuestra(r.data.data)).catch(()=>{});
    API.get('/api/muestras/' + codigo + '/qr').then(r=> setQr(r.data.data.dataUrl)).catch(()=>{});
  },[codigo])

  function print(){ window.print(); }

  if(!muestra) return <div className="container py-3">Cargando...</div>
  return (
    <div className="container py-3">
      <div className="card" style={{maxWidth:420}}>
        <div className="card-body text-center">
          <h4 className="card-title">LABEXPRESS-LIS</h4>
          <p><strong>Código de muestra:</strong> {muestra.codigo_qr}</p>
          {qr && <img src={qr} alt="QR" style={{width:160,height:160}} />}
          <p><strong>Número de orden:</strong> {muestra.id_orden}</p>
          <p><strong>Tipo de muestra:</strong> {muestra.tipo_muestra}</p>
          <div className="mt-3"><button className="btn btn-primary" onClick={print}>Imprimir etiqueta</button></div>
        </div>
      </div>
    </div>
  )
}
