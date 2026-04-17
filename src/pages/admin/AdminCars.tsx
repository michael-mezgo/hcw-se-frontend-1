import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCars, deleteCar } from '../../api/cars'
import type { CarResponse } from '../../api/cars'

const FUEL_LABELS: Record<string, string> = {
  DIESEL: 'Diesel',
  GASOLINE: 'Benzin',
  ELECTRIC: 'Elektro',
  HYBRID: 'Hybrid',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  AUTOMATIC: 'Automatik',
  MANUAL: 'Manuell',
}

export default function AdminCars() {
  const [cars, setCars] = useState<CarResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)
      setCars(await getCars())
    } catch {
      setError('Fahrzeuge konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(car: CarResponse) {
    if (!confirm(`Fahrzeug "${car.manufacturer} ${car.model}" wirklich löschen?`)) return
    try {
      await deleteCar(car.id)
      setCars(prev => prev.filter(c => c.id !== car.id))
    } catch {
      setError('Löschen fehlgeschlagen.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fahrzeugverwaltung</h1>
          <p className="text-sm text-gray-500 mt-1">{cars.length} Fahrzeuge gesamt</p>
        </div>
        <Link
          to="/admin/cars/new"
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 text-sm font-medium"
        >
          + Fahrzeug erstellen
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Lädt...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fahrzeug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jahr</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Antrieb</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leistung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preis/Tag</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cars.map(car => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono">{car.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link to={`/admin/cars/${car.id}`} className="hover:text-slate-600 hover:underline">
                      {car.manufacturer} {car.model}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{car.year}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="block">{TRANSMISSION_LABELS[car.transmission] ?? car.transmission}</span>
                    <span className="text-xs text-gray-400">{FUEL_LABELS[car.fuelType] ?? car.fuelType}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{car.power} PS</td>
                  <td className="px-4 py-3 text-gray-600">{car.pricePerDay.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    {car.isAvailable ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Verfügbar
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Nicht verfügbar
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={`/admin/cars/${car.id}`}
                        className="text-slate-600 hover:text-slate-900 text-xs px-2 py-1 rounded border border-gray-200 hover:border-gray-400"
                      >
                        Bearbeiten
                      </Link>
                      <button
                        onClick={() => handleDelete(car)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-200 hover:border-red-400"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <p className="text-center text-gray-500 py-8">Keine Fahrzeuge gefunden.</p>
          )}
        </div>
      )}
    </div>
  )
}
