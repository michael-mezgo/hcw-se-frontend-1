import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  userId: number | null
  isAdmin: boolean
  setUserId: (id: number | null) => void
  setIsAdmin: (admin: boolean) => void
  setToken: (token: string | null) => void
  logout: () => void
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

  function setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  function logout() {
    setToken(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ userId, isAdmin, setUserId, setIsAdmin, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
