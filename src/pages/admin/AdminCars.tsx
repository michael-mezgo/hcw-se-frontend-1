import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCars, deleteCar } from '../../api/cars'
import type { CarResponse } from '../../api/cars'

const FUEL_LABELS: Record<string, string> = {
  DIESEL: 'Diesel',
  GASOLINE: 'Gasoline',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  AUTOMATIC: 'Automatic',
  MANUAL: 'Manual',
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
      setError('Cars could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(car: CarResponse) {
    if (!confirm(`Are you sure you want to delete this "${car.manufacturer} ${car.model}"?`)) return
    try {
      await deleteCar(car.id)
      setCars(prev => prev.filter(c => c.id !== car.id))
    } catch {
      setError('Deletion failed.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car management</h1>
          <p className="text-sm text-gray-500 mt-1">{cars.length} Cars in total</p>
        </div>
        <Link
          to="/admin/cars/new"
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 text-sm font-medium"
        >
          + Add Car
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Car</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year of manufacture</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode of driving</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Power</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/DaY</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="px-4 py-3 text-gray-600">{car.power} HP</td>
                  <td className="px-4 py-3 text-gray-600">{car.pricePerDay.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    {car.isAvailable ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Not available
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={`/admin/cars/${car.id}`}
                        className="text-slate-600 hover:text-slate-900 text-xs px-2 py-1 rounded border border-gray-200 hover:border-gray-400"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(car)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-200 hover:border-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <p className="text-center text-gray-500 py-8">No Cars found.</p>
          )}
        </div>
      )}
    </div>
  )
}
