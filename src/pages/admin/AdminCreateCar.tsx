import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCar } from '../../api/cars'
import type { CarCreateRequest, Transmission, FuelType } from '../../api/cars'

interface CarForm {
  manufacturer: string
  model: string
  year: string
  pricePerDay: string
  description: string
  imageUrl: string
  transmission: Transmission
  power: string
  fuelType: FuelType
}

const TEXT_FIELDS: { name: keyof CarForm; label: string; type?: string }[] = [
  { name: 'manufacturer', label: 'Hersteller' },
  { name: 'model', label: 'Modell' },
  { name: 'year', label: 'Baujahr', type: 'number' },
  { name: 'power', label: 'Leistung (PS)', type: 'number' },
  { name: 'pricePerDay', label: 'Preis pro Tag (€)', type: 'number' },
  { name: 'imageUrl', label: 'Bild-URL', type: 'url' },
  { name: 'description', label: 'Beschreibung' },
]

export default function AdminCreateCar() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CarForm>({
    manufacturer: '', model: '', year: '', pricePerDay: '',
    description: '', imageUrl: '', transmission: 'AUTOMATIC',
    power: '', fuelType: 'GASOLINE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data: CarCreateRequest = {
      manufacturer: form.manufacturer,
      model: form.model,
      year: Number(form.year),
      pricePerDay: Number(form.pricePerDay),
      description: form.description,
      imageUrl: form.imageUrl,
      transmission: form.transmission,
      power: Number(form.power),
      fuelType: form.fuelType,
    }
    try {
      const { id } = await createCar(data)
      navigate(`/admin/cars/${id}`)
    } catch {
      setError('Erstellen fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/cars" className="text-slate-500 hover:text-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Neues Fahrzeug</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        {TEXT_FIELDS.map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}<span className="text-red-500 ml-1">*</span>
            </label>
            {name === 'description' ? (
              <textarea
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            ) : (
              <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                required
                step={type === 'number' ? (name === 'pricePerDay' ? '0.01' : '1') : undefined}
                min={type === 'number' ? '0' : undefined}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Getriebe<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={form.transmission}
            onChange={e => setForm(f => ({ ...f, transmission: e.target.value as Transmission }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="AUTOMATIC">Automatik</option>
            <option value="MANUAL">Manuell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kraftstoff<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={form.fuelType}
            onChange={e => setForm(f => ({ ...f, fuelType: e.target.value as FuelType }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="GASOLINE">Benzin</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Elektro</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Erstellt...' : 'Erstellen'}
          </button>
          <Link
            to="/admin/cars"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
