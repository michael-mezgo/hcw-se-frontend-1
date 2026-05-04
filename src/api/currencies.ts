import { apiFetch } from './client'

export function getCurrencies() {
  return apiFetch<string[]>('/currency-service')
}