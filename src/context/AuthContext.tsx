import { createContext, useContext, useState, ReactNode } from 'react'
import { logout as apiLogout } from '../api/auth'

interface AuthContextValue {
  userId: number | null
  isAdmin: boolean
  setUserId: (id: number | null) => void
  setIsAdmin: (admin: boolean) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem('userId')
    return stored ? Number(stored) : null
  })
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true'
  })

  function setUserId(id: number | null) {
    if (id !== null) {
      localStorage.setItem('userId', String(id))
    } else {
      localStorage.removeItem('userId')
      localStorage.removeItem('isAdmin')
      setIsAdminState(false)
    }
    setUserIdState(id)
  }

  function setIsAdmin(admin: boolean) {
    localStorage.setItem('isAdmin', String(admin))
    setIsAdminState(admin)
  }

  async function logout() {
    await apiLogout()
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ userId, isAdmin, setUserId, setIsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
