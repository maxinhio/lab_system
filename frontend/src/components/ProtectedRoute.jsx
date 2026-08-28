import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUser } from '../utils/auth'

export default function ProtectedRoute({ children, roles }){
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length>0 && !roles.includes(user.rol)) return <Navigate to="/403" replace />;
  return children;
}
