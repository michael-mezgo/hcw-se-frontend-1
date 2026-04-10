import { apiFetch } from './client'

export type Transmission = 'AUTOMATIC' | 'MANUAL'
export type FuelType = 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID'

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

export function updateCar(id: number, data: CarUpdateRequest) {
  return apiFetch<{ message: string }>(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteCar(id: number) {
  return apiFetch<void>(`/cars/${id}`, { method: 'DELETE' })
}
