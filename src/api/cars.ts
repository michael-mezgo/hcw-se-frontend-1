import { apiFetch } from './client'

export type Transmission = 'AUTOMATIC' | 'MANUAL'
export type FuelType = 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID'

export interface Location {
  latitude: number
  longitude: number
}

export interface CarResponse {
  id: number
  manufacturer: string
  model: string
  year: number
  pricePerDay: number
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
  pricePerDay: number
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
  pricePerDay?: number
  description?: string
  imageUrl?: string
  transmission?: Transmission
  power?: number
  fuelType?: FuelType
  location?: Location
}

export function getCars() {
  return apiFetch<CarResponse[]>('/cars')
}

export function getCar(id: number) {
  return apiFetch<CarResponse>(`/cars/${id}`)
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

export function deleteCar(id: number) {
  return apiFetch<void>(`/cars/${id}`, { method: 'DELETE' })
}
