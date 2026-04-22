import { apiFetch } from './client'

export type Transmission = 'AUTOMATIC' | 'MANUAL'
export type FuelType = 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID'

export interface Location {
  latitude: number
  longitude: number
}

export interface CurrencyDto {
  amount: number
  currencyCode: string
}

export interface BookedByUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
  isAdmin: boolean
  isLocked: boolean
}

export interface CarBookingResponse {
  carId: number
  bookedBy: BookedByUser
}

export interface CarResponse {
  id: number
  manufacturer: string
  model: string
  year: number
  pricePerDay: CurrencyDto
  description: string
  imageUrl: string
  transmission: Transmission
  power: number
  fuelType: FuelType
  isAvailable: boolean
  location: Location
}

export interface CarCreateRequest {
  manufacturer: string
  model: string
  year: number
  pricePerDayInUSD: number
  description: string
  imageUrl: string
  transmission: Transmission
  power: number
  fuelType: FuelType
  location: Location
}

export interface CarUpdateRequest {
  manufacturer?: string
  model?: string
  year?: number
  pricePerDayInUSD?: number
  description?: string
  imageUrl?: string
  transmission?: Transmission
  power?: number
  fuelType?: FuelType
  location?: Location
}

export function getCars(availableOnly?: boolean) {
  const url = availableOnly ? '/cars?available=true' : '/cars'
  return apiFetch<CarResponse[]>(url)
}

export function getCar(id: number, currencyCode?: string) {
  const url = currencyCode ? `/cars/${id}?currencyCode=${encodeURIComponent(currencyCode)}` : `/cars/${id}`
  return apiFetch<CarResponse>(url)
}

export function getCarBooking(id: number) {
  return apiFetch<CarBookingResponse>(`/cars/${id}/booking`)
}

export function createCar(data: CarCreateRequest) {
  return apiFetch<{ id: number }>('/cars', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function createCarWithImage(
  data: Omit<CarCreateRequest, 'imageUrl'>,
  image?: File,
): Promise<{ id: number }> {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  if (image) {
    formData.append('image', image)
  }
  const res = await fetch('/cars', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json()
}

export function updateCar(id: number, data: CarUpdateRequest) {
  return apiFetch<{ message: string }>(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function updateCarWithImage(
  id: number,
  data: Omit<CarUpdateRequest, 'imageUrl'>,
  image?: File,
): Promise<{ message: string }> {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  if (image) {
    formData.append('image', image)
  }
  const res = await fetch(`/cars/${id}`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json()
}

export function deleteCar(id: number) {
  return apiFetch<void>(`/cars/${id}`, { method: 'DELETE' })
}

export function bookCar(carId: number) {
  return apiFetch<void>(`/cars/${carId}/book`, { method: 'POST' })
}

export function unbookCar(carId: number) {
  return apiFetch<void>(`/cars/${carId}/unbook`, { method: 'POST' })
}