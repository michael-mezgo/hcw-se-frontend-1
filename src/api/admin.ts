import { apiFetch } from './client'
import type { UserProfile } from './users'

export type AdminUserProfile = UserProfile

export interface CreateUserData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
  isAdmin?: boolean
}

export interface AdminUpdateUserData {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  licenseNumber?: string
  licenseValidUntil?: string
  isAdmin?: boolean
  isLocked?: boolean
}

export function adminGetUsers() {
  return apiFetch<AdminUserProfile[]>('/users')
}

export function adminGetUser(id: number) {
  return apiFetch<AdminUserProfile>(`/users/${id}`)
}

export function adminCreateUser(data: CreateUserData) {
  return apiFetch<{ id: number }>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateUser(id: number, data: AdminUpdateUserData) {
  return apiFetch<{ message: string }>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function adminDeleteUser(id: number) {
  return apiFetch<void>(`/users/${id}`, { method: 'DELETE' })
}
