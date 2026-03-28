import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const FIELDS = [
  { name: 'username', label: 'Benutzername', type: 'text' },
  { name: 'email', label: 'E-Mail', type: 'email' },
  { name: 'password', label: 'Passwort', type: 'password' },
  { name: 'firstName', label: 'Vorname', type: 'text' },
  { name: 'lastName', label: 'Nachname', type: 'text' },
  { name: 'licenseNumber', label: 'Führerscheinnummer', type: 'text' },
  { name: 'licenseValidUntil', label: 'Führerschein gültig bis', type: 'date' },
] as const

type FormState = Record<(typeof FIELDS)[number]['name'], string>

const INITIAL: FormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  licenseNumber: '',
  licenseValidUntil: '',
}

export default function Register() {
  const { setUserId } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      const { userId } = await login(form.username, form.password)
      setUserId(userId)
      navigate('/profile')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('409') || msg.toLowerCase().includes('conflict')) {
        setError('Benutzername oder E-Mail bereits vergeben.')
      } else {
        setError('Registrierung fehlgeschlagen.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Registrieren</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Lädt...' : 'Konto erstellen'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Bereits ein Konto?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
