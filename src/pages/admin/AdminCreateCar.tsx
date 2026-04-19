import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCarWithImage } from '../../api/cars'
import type { Transmission, FuelType } from '../../api/cars'

interface CarForm {
  manufacturer: string
  model: string
  year: string
  pricePerDay: string
  description: string
  transmission: Transmission
  power: string
  fuelType: FuelType
  latitude: string
  longitude: string
}

const TEXT_FIELDS: { name: keyof CarForm; label: string; type?: string }[] = [
  { name: 'manufacturer', label: 'Manufacturer' },
  { name: 'model', label: 'Model' },
  { name: 'year', label: 'Year of manufacture', type: 'number' },
  { name: 'power', label: 'Power (HP)', type: 'number' },
  { name: 'pricePerDay', label: 'Price per Day (€)', type: 'number' },
  { name: 'description', label: 'Description' },
]

function safeBlobUrl(url: string): string {
  try {
    return new URL(url).protocol === 'blob:' ? url : ''
  } catch {
    return ''
  }
}

export default function AdminCreateCar() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CarForm>({
    manufacturer: '', model: '', year: '', pricePerDay: '',
    description: '', transmission: 'AUTOMATIC',
    power: '', fuelType: 'GASOLINE', latitude: '', longitude: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageFile(e.target.files?.[0] ?? null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data = {
      manufacturer: form.manufacturer,
      model: form.model,
      year: Number(form.year),
      pricePerDay: Number(form.pricePerDay),
      description: form.description,
      transmission: form.transmission,
      power: Number(form.power),
      fuelType: form.fuelType,
      location: { latitude: Number(form.latitude), longitude: Number(form.longitude) },
    }
    try {
      const { id } = await createCarWithImage(data, imageFile ?? undefined)
      navigate(`/admin/cars/${id}`)
    } catch {
      setError('Creation failed.')
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
        <h1 className="text-2xl font-bold text-gray-900">New Car</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Car image</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-slate-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img
                src={safeBlobUrl(imagePreview) /* codeql[js/xss-through-dom] */}
                alt="Vorschau"
                className="mx-auto max-h-48 rounded object-contain"
              />
            ) : (
              <div className="text-sm text-gray-500 py-4">
                <svg className="mx-auto w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a3 3 0 014.24 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Select image (optional)
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {imageFile && (
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{imageFile.name}</span>
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={form.transmission}
            onChange={e => setForm(f => ({ ...f, transmission: e.target.value as Transmission }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel type<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={form.fuelType}
            onChange={e => setForm(f => ({ ...f, fuelType: e.target.value as FuelType }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="GASOLINE">Gasoline</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              value={form.latitude}
              onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
              required
              step="any"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              value={form.longitude}
              onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
              required
              step="any"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
          <Link
            to="/admin/cars"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
