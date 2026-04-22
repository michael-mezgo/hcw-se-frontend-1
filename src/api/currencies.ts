import { apiFetch } from './client'

export function getCurrencies() {
  return apiFetch<string[]>('http://localhost:8080/currency-service')
}