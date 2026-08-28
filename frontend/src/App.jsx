import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Pacientes from './pages/Pacientes'
import PacientesNuevo from './pages/PacientesNuevo'
import Examenes from './pages/Examenes'
import Categorias from './pages/Categorias'
import Ordenes from './pages/Ordenes'
import OrdenesNuevo from './pages/OrdenesNuevo'
import Muestras from './pages/Muestras'
import MuestraPrint from './pages/MuestraPrint'
import Resultados from './pages/Resultados'
import ResultadoOrden from './pages/ResultadoOrden'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Forbidden from './pages/Forbidden'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/403" element={<Forbidden/>} />
        <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Dashboard/>} />
          <Route path="pacientes" element={<ProtectedRoute roles={['Administrador','Recepcionista']}><Pacientes/></ProtectedRoute>} />
          <Route path="pacientes/nuevo" element={<ProtectedRoute roles={['Administrador','Recepcionista']}><PacientesNuevo/></ProtectedRoute>} />
          <Route path="examenes" element={<ProtectedRoute roles={['Administrador']}><Examenes/></ProtectedRoute>} />
          <Route path="categorias" element={<ProtectedRoute roles={['Administrador']}><Categorias/></ProtectedRoute>} />
          <Route path="ordenes" element={<ProtectedRoute roles={['Administrador','Recepcionista']}><Ordenes/></ProtectedRoute>} />
          <Route path="ordenes/nueva" element={<ProtectedRoute roles={['Administrador','Recepcionista']}><OrdenesNuevo/></ProtectedRoute>} />
          <Route path="muestras" element={<ProtectedRoute roles={['Administrador','Bioquímico']}><Muestras/></ProtectedRoute>} />
          <Route path="muestras/print/:codigo" element={<ProtectedRoute roles={['Administrador','Bioquímico','Recepcionista']}><MuestraPrint/></ProtectedRoute>} />
          <Route path="resultados" element={<ProtectedRoute roles={['Administrador','Bioquímico','Analista']}><Resultados/></ProtectedRoute>} />
          <Route path="resultados/:ordenId" element={<ProtectedRoute roles={['Administrador','Bioquímico','Analista']}><ResultadoOrden/></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
