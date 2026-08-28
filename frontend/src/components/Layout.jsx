import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../utils/auth'
import './layout.css'

function Sidebar(){
  const user = getUser();
  const rol = user?user.rol:null;
  const norm = s => (s||'').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  return (
    <aside className="sidebar">
      <div className="brand"><div className="logo"/> <div className="title">LABEXPRESS-LIS</div></div>
      <nav>
        <ul>
          <li><NavLink to="/" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Dashboard</NavLink></li>
          {(rol && norm(rol)===norm('Administrador')) && <>
            <li><NavLink to="/usuarios" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Usuarios</NavLink></li>
            <li><NavLink to="/empleados" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Empleados</NavLink></li>
            <li><NavLink to="/roles" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Roles</NavLink></li>
            <li><NavLink to="/reactivos" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Reactivos</NavLink></li>
            <li><NavLink to="/equipos" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Equipos</NavLink></li>
          </>}
          {((rol && norm(rol)===norm('Recepcionista')) || (rol && norm(rol)===norm('Administrador'))) && <>
            <li><NavLink to="/pacientes" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Pacientes</NavLink></li>
            <li><NavLink to="/ordenes" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Órdenes</NavLink></li>
            <li><NavLink to="/pagos" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Pagos</NavLink></li>
          </>}
          {((rol && norm(rol)===norm('Bioquímico')) || (rol && norm(rol)===norm('Administrador'))) && <>
            <li><NavLink to="/muestras" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Muestras</NavLink></li>
            <li><NavLink to="/resultados" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Resultados</NavLink></li>
          </>}
        </ul>
      </nav>
    </aside>
  )
}

function Header(){
  const user = getUser();
  const navigate = useNavigate();
  const initials = user? user.username.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase() : '';
  function handleLogout(){
    try{
      console.log('Logging out user - before clear', { token: localStorage.getItem('token'), user: localStorage.getItem('user') });
      // force clear and redirect (bypass React navigation to ensure full reset)
      try{ localStorage.clear(); }catch(e){ console.warn('localStorage clear failed', e) }
      console.log('Logging out user - after clear', { token: localStorage.getItem('token'), user: localStorage.getItem('user') });
      // use replace to avoid back navigation to protected pages
      window.location.replace('/login');
    }catch(e){
      console.error('Logout error', e);
      try{ localStorage.clear(); }catch(_){}
      window.location.href = '/login';
    }
  }
  return (
    <header className="header">
      <div className="brand">
        <div className="logo" style={{width:44,height:44,borderRadius:8}} />
        <div>
          <div className="h5 mb-0">LABEXPRESS</div>
          <div className="text-muted small">Sistema de Información de Laboratorio</div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="text-end me-3 d-none d-md-block">
          <div className="small text-muted">Usuario</div>
          <div className="fw-bold">{user?user.username:'-'}</div>
        </div>
        <div className="avatar" title={user?user.username:'Usuario'}>{initials}</div>
        <button type="button" className="btn btn-outline-secondary btn-ghost" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </header>
  )
}

export default function Layout(){
  return (
    <div className="app-root">
      <Sidebar />
      <div className="main-area">
        <Header />
        <div className="content"><Outlet/></div>
      </div>
    </div>
  )
}
