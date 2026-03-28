import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type {ReactNode} from 'react'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { userId, isAdmin } = useAuth()
  if (userId === null) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}
