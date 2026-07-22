import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminBlock({ children }) {
  const { isLoggedIn, isAdmin } = useAuth()
  if (isLoggedIn && isAdmin) return <Navigate to="/admin" replace />
  return children
}
