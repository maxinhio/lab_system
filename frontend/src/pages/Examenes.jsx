import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Examenes(){
  const [examenes,setExamenes]=useState([])
  useEffect(()=>{ axios.get('/api/examenes').then(r=>setExamenes(r.data.data)).catch(()=>{}) },[])
  return (
    <div style={{padding:20}}>
      <h2>Exámenes</h2>
      <table border="1" cellPadding={6}>
        <thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th></tr></thead>
        <tbody>
          {examenes.map(e=> <tr key={e.id_examen}><td>{e.id_examen}</td><td>{e.nombre_examen}</td><td>{e.nombre_categoria}</td><td>{e.precio}</td><td>{e.estado}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
