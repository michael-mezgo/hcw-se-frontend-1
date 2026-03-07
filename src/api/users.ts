import { apiFetch } from './client'

export interface UserProfile {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
}

export interface UpdateUserData {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  licenseNumber?: string
  licenseValidUntil?: string
}

export function getUser(id: number) {
  return apiFetch<UserProfile>(`/users/${id}`)
}

export function updateUser(id: number, data: UpdateUserData) {
  return apiFetch<{ message: string }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteUser(id: number) {
  return apiFetch<void>(`/users/${id}`, { method: 'DELETE' })
}
