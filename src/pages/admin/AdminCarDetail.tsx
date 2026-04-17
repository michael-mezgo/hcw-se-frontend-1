import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCar, updateCar, deleteCar } from '../../api/cars'
import type { CarResponse, CarUpdateRequest, Transmission, FuelType } from '../../api/cars'

interface EditForm {
  manufacturer: string
  model: string
  year: string
  pricePerDay: string
  description: string
  imageUrl: string
  transmission: Transmission
  power: string
  fuelType: FuelType
  latitude: string
  longitude: string
}

const TEXT_FIELDS: { name: keyof EditForm; label: string; type?: string }[] = [
  { name: 'manufacturer', label: 'Hersteller' },
  { name: 'model', label: 'Modell' },
  { name: 'year', label: 'Baujahr', type: 'number' },
  { name: 'power', label: 'Leistung (PS)', type: 'number' },
  { name: 'pricePerDay', label: 'Preis pro Tag (€)', type: 'number' },
  { name: 'imageUrl', label: 'Bild-URL', type: 'url' },
  { name: 'description', label: 'Beschreibung' },
]

export default function AdminCarDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarResponse | null>(null)
  const [form, setForm] = useState<EditForm>({
    manufacturer: '', model: '', year: '', pricePerDay: '',
    description: '', imageUrl: '', transmission: 'AUTOMATIC',
    power: '', fuelType: 'GASOLINE', latitude: '', longitude: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id) return
    getCar(Number(id))
      .then(c => {
        setCar(c)
        setForm({
          manufacturer: c.manufacturer,
          model: c.model,
          year: String(c.year),
          pricePerDay: String(c.pricePerDay),
          description: c.description,
          imageUrl: c.imageUrl,
          transmission: c.transmission,
          power: String(c.power),
          fuelType: c.fuelType,
          latitude: String(c.location?.latitude ?? ''),
          longitude: String(c.location?.longitude ?? ''),
        })
      })
      .catch(() => setError('Fahrzeug nicht gefunden.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError('')
    setSuccess('')
    const data: CarUpdateRequest = {
      manufacturer: form.manufacturer,
      model: form.model,
      year: Number(form.year),
      pricePerDay: Number(form.pricePerDay),
      description: form.description,
      imageUrl: form.imageUrl,
      transmission: form.transmission,
      power: Number(form.power),
      fuelType: form.fuelType,
      location: form.latitude && form.longitude
        ? { latitude: Number(form.latitude), longitude: Number(form.longitude) }
        : undefined,
    }
    try {
      await updateCar(Number(id), data)
      setSuccess('Fahrzeug erfolgreich aktualisiert.')
    } catch {
      setError('Aktualisierung fehlgeschlagen.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || !car) return
    if (!confirm(`Fahrzeug "${car.manufacturer} ${car.model}" wirklich löschen?`)) return
    try {
      await deleteCar(Number(id))
      navigate('/admin/cars')
    } catch {
      setError('Löschen fehlgeschlagen.')
    }
  }

  if (loading) return <p className="text-gray-500">Lädt...</p>
  if (!car) return <p className="text-red-500">{error || 'Fahrzeug nicht gefunden.'}</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/cars" className="text-slate-500 hover:text-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{car.manufacturer} {car.model}</h1>
          <p className="text-sm text-gray-500">Fahrzeug #{car.id}</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        {TEXT_FIELDS.map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {name === 'description' ? (
              <textarea
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            ) : (
              <input
                type={type}
                value={form[name]}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                step={type === 'number' ? (name === 'pricePerDay' ? '0.01' : '1') : undefined}
                min={type === 'number' ? '0' : undefined}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Getriebe</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Kraftstoff</label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breitengrad</label>
            <input
              type="number"
              value={form.latitude}
              onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
              step="any"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Längengrad</label>
            <input
              type="number"
              value={form.longitude}
              onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
              step="any"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Speichert...' : 'Speichern'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            Fahrzeug löschen
          </button>
        </div>
      </form>
    </div>
  )
}
