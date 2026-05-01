import { apiFetch } from './client'
import type { CarResponse } from './cars'

export interface UserProfile {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
  isAdmin: boolean
  isLocked: boolean
  preferredCurrency: string
}

export interface UpdateUserData {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  licenseNumber?: string
  licenseValidUntil?: string
  preferredCurrency?: string
}

export function getUser() {
  return apiFetch<UserProfile>(`/users/me`)
}

export function updateUser(data: UpdateUserData) {
  return apiFetch<{ message: string }>(`/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteUser() {
  return apiFetch<void>(`/users/me`, { method: 'DELETE' })
}

export function getMyBookedCars(currencyCode?: string) {
  const url = currencyCode ? `/users/me/cars?currencyCode=${encodeURIComponent(currencyCode)}` : '/users/me/cars'
  return apiFetch<CarResponse[]>(url)
}
