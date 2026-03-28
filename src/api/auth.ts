import { apiFetch } from './client'

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
}

export function register(data: RegisterData) {
  return apiFetch<{ id: number }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(username: string, password: string) {
  return apiFetch<{ token: string; userId: number; isAdmin: boolean }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}
