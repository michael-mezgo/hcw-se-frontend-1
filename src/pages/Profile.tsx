import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, updateUser, deleteUser, getMyBookedCars } from '../api/users'
import type { UserProfile, UpdateUserData } from '../api/users'
import type { CarResponse } from '../api/cars'
import { unbookCar } from '../api/cars'
import { useAuth } from '../context/AuthContext'
import { getCurrencies } from '../api/currencies'

interface EditForm {
  email: string
  password: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
  preferredCurrency: string
}

const TEXT_FIELDS: { name: keyof EditForm; label: string; type?: string }[] = [
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'firstName', label: 'First name' },
  { name: 'lastName', label: 'Last name' },
  { name: 'licenseNumber', label: 'License number' },
  { name: 'licenseValidUntil', label: 'License valid until', type: 'date' },
  { name: 'password', label: 'New Password (optional)', type: 'password' },
]

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  )
}

export default function Profile() {
  const { userId, setUserId, setIsAdmin, preferredCurrency, setPreferredCurrency } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<EditForm>({
    email: '', password: '', firstName: '', lastName: '',
    licenseNumber: '', licenseValidUntil: '', preferredCurrency: 'USD',
  })
  const [currencies, setCurrencies] = useState<string[]>(['USD'])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookedCars, setBookedCars] = useState<CarResponse[]>([])

  useEffect(() => {
    if (!userId) return
    getUser().then(p => {
      setProfile(p)
      setIsAdmin(p.isAdmin)
      setPreferredCurrency(p.preferredCurrency ?? 'USD')
      getMyBookedCars(p.preferredCurrency ?? 'USD').then(setBookedCars).catch(() => {})
    }).catch(() => {
      setUserId(null)
      navigate('/login')
    })
  }, [userId, navigate, setUserId, setIsAdmin])

  useEffect(() => {
    getCurrencies()
      .then(data => setCurrencies(data.length > 0 ? data : ['USD']))
      .catch(() => setCurrencies(['USD']))
  }, [])

  function startEditing() {
    if (!profile) return
    setForm({
      email: profile.email,
      password: '',
      firstName: profile.firstName,
      lastName: profile.lastName,
      licenseNumber: profile.licenseNumber,
      licenseValidUntil: profile.licenseValidUntil,
      preferredCurrency: profile.preferredCurrency ?? 'USD',
    })
    setEditing(true)
    setError('')
    setSuccess('')
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    setError('')
    setSuccess('')
    const data: UpdateUserData = {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      licenseNumber: form.licenseNumber,
      licenseValidUntil: form.licenseValidUntil,
      preferredCurrency: form.preferredCurrency,
    }
    if (form.password) data.password = form.password
    try {
      await updateUser(data)
      const updated = await getUser()
      setProfile(updated)
      setPreferredCurrency(updated.preferredCurrency ?? 'USD')
      const cars = await getMyBookedCars(updated.preferredCurrency ?? 'USD')
      setBookedCars(cars)
      setEditing(false)
      setSuccess('Profile updated successfully.')
    } catch {
      setError('Update failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUnbook(carId: number) {
    try {
      await unbookCar(carId)
      setBookedCars(prev => prev.filter(c => c.id !== carId))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('403')) setError('You can only cancel your own bookings.')
      else setError('Unbooking failed.')
    }
  }

  async function handleDelete() {
    if (!userId) return
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    try {
      await deleteUser()
      setUserId(null)
      navigate('/')
    } catch {
      setError('Deletion failed.')
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!editing ? (
          <div className="bg-white rounded-xl shadow p-6">
            <ProfileRow label="User name" value={profile.username} />
            <ProfileRow label="E-mail" value={profile.email} />
            <ProfileRow label="First name" value={profile.firstName} />
            <ProfileRow label="Last name" value={profile.lastName} />
            <ProfileRow label="License number" value={profile.licenseNumber} />
            <ProfileRow label="License valid until" value={profile.licenseValidUntil} />
            <ProfileRow label="Preferred currency" value={preferredCurrency} />
            <div className="flex gap-3 mt-6">
              <button
                onClick={startEditing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Delete account
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow p-6 space-y-4">
            {TEXT_FIELDS.map(({ name, label, type = 'text' }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[name]}
                  onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred currency</label>
              <select
                value={form.preferredCurrency}
                onChange={e => setForm(f => ({ ...f, preferredCurrency: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h2>
          {bookedCars.length === 0 ? (
            <p className="text-gray-500 text-sm">No active Bookings to display.</p>
          ) : (
            <div className="grid gap-4">
              {bookedCars.map(car => (
                <div key={car.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                  {car.imageUrl && (
                    <img
                      src={car.imageUrl}
                      alt={`${car.manufacturer} ${car.model}`}
                      className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">
                      {car.manufacturer} {car.model} ({car.year})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{car.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                      <span>{car.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'}</span>
                      <span>{car.power} HP</span>
                      <span>{car.fuelType}</span>
                      <span className="font-medium text-blue-600">{car.pricePerDay.amount.toFixed(2)} {car.pricePerDay.currencyCode}/Day</span>
                    </div>
                    <button
                      onClick={() => handleUnbook(car.id)}
                      className="mt-3 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-xs"
                    >
                      Unbook
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
