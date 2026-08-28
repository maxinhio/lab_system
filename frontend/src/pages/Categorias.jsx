import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Categorias(){
  const [cats,setCats]=useState([])
  useEffect(()=>{ axios.get('/api/categorias').then(r=>setCats(r.data.data)).catch(()=>{}) },[])
  return (
    <div style={{padding:20}}>
      <h2>Categorías</h2>
      <ul>
        {cats.map(c=> <li key={c.id_categoria}>{c.nombre_categoria} - {c.descripcion}</li>)}
      </ul>
    </div>
  )
}
