import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCar, getCarBooking, updateCarWithImage, deleteCar, unbookCar } from '../../api/cars'
import type { CarResponse, CarUpdateRequest, CarBookingResponse, Transmission, FuelType, BookedByUser } from '../../api/cars'

interface EditForm {
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

const TEXT_FIELDS: { name: keyof EditForm; label: string; type?: string }[] = [
  { name: 'manufacturer', label: 'Manufacturer' },
  { name: 'model', label: 'Model' },
  { name: 'year', label: 'Year of manufacture', type: 'number' },
  { name: 'power', label: 'Power (HP)', type: 'number' },
  { name: 'pricePerDay', label: 'Price per Day (€)', type: 'number' },
  { name: 'description', label: 'Description' },
]

export default function AdminCarDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarResponse | null>(null)
  const [booking, setBooking] = useState<CarBookingResponse | null>(null)
  const [form, setForm] = useState<EditForm>({
    manufacturer: '', model: '', year: '', pricePerDay: '',
    description: '', transmission: 'AUTOMATIC',
    power: '', fuelType: 'GASOLINE', latitude: '', longitude: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
          pricePerDay: String(c.pricePerDay.amount),
          description: c.description,
          transmission: c.transmission,
          power: String(c.power),
          fuelType: c.fuelType,
          latitude: String(c.location?.latitude ?? ''),
          longitude: String(c.location?.longitude ?? ''),
        })
        return getCarBooking(Number(id)).catch(() => null)
      })
      .then(b => setBooking(b))
      .catch(() => setError('Car not found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError('')
    setSuccess('')
    const data: Omit<CarUpdateRequest, 'imageUrl'> = {
      manufacturer: form.manufacturer,
      model: form.model,
      year: Number(form.year),
      pricePerDayInUSD: Number(form.pricePerDay),
      description: form.description,
      transmission: form.transmission,
      power: Number(form.power),
      fuelType: form.fuelType,
      location: form.latitude && form.longitude
        ? { latitude: Number(form.latitude), longitude: Number(form.longitude) }
        : undefined,
    }
    try {
      await updateCarWithImage(Number(id), data, imageFile ?? undefined)
      setSuccess('Car updated successfully.')
      if (imageFile) {
        setImagePreview(URL.createObjectURL(imageFile))
        setImageFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch {
      setError('Update failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleUnbook() {
    if (!id || !car) return
    if (!confirm(`Are you sure you want to undo booking this "${car.manufacturer} ${car.model}"?`)) return
    try {
      await unbookCar(Number(id))
      setCar(c => c ? { ...c, isAvailable: true } : c)
      setBooking(null)
      setSuccess('Booking undone successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('409')) setError('Car is not booked.')
      else setError('Reverting the booking process failed.')
    }
  }

  async function handleDelete() {
    if (!id || !car) return
    if (!confirm(`Are you sure you want to delete this "${car.manufacturer} ${car.model}"?`)) return
    try {
      await deleteCar(Number(id))
      navigate('/admin/cars')
    } catch {
      setError('Deletion failed.')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!car) return <p className="text-red-500">{error || 'Car not found.'}</p>

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
          <p className="text-sm text-gray-500">Car #{car.id}</p>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Car image</label>
          <img
            src={imagePreview ?? car.imageUrl}
            alt={`${car.manufacturer} ${car.model}`}
            className="w-full h-48 object-cover rounded-lg mb-3 bg-gray-100"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0] ?? null
              setImageFile(file)
              if (file) setImagePreview(URL.createObjectURL(file))
            }}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
          {imageFile && (
            <p className="text-xs text-gray-500 mt-1">New image selected: {imageFile.name}</p>
          )}
        </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuel type</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              value={form.latitude}
              onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
              step="any"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
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
            {saving ? 'Saving...' : 'Save'}
          </button>
          {!car.isAvailable && (
            <button
              type="button"
              onClick={handleUnbook}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 text-sm"
            >
              Undo Booking
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            Delete Car
          </button>
        </div>
      </form>

      {booking ? (
        <BookedByCard user={booking.bookedBy} />
      ) : (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm text-green-700">
          Car is currently not booked.
        </div>
      )}
    </div>
  )
}

function BookedByCard({ user }: { user: BookedByUser }) {
  return (
    <div className="mt-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Booked by</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-gray-500">User name</dt>
          <dd className="font-medium text-gray-900">@{user.username}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Name</dt>
          <dd className="font-medium text-gray-900">{user.firstName} {user.lastName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">E-mail</dt>
          <dd className="font-medium text-gray-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-gray-500">License No.</dt>
          <dd className="font-medium text-gray-900">{user.licenseNumber}</dd>
        </div>
        <div>
          <dt className="text-gray-500">License valid until</dt>
          <dd className="font-medium text-gray-900">{user.licenseValidUntil}</dd>
        </div>
        <div>
          <dt className="text-gray-500">User ID</dt>
          <dd className="font-mono text-gray-500">#{user.id}</dd>
        </div>
      </dl>
    </div>
  )
}
