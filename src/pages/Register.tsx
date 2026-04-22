import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, login } from '../api/auth'
import { getUser } from '../api/users'
import { getCurrencies } from '../api/currencies'
import { useAuth } from '../context/AuthContext'

const FIELDS = [
  { name: 'username', label: 'User name', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'firstName', label: 'First name', type: 'text' },
  { name: 'lastName', label: 'Last name', type: 'text' },
  { name: 'licenseNumber', label: 'License number', type: 'text' },
  { name: 'licenseValidUntil', label: 'License valid until', type: 'date' },
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
  const { setUserId, setIsAdmin, setToken, setPreferredCurrency } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [preferredCurrency, setCurrency] = useState('USD')
  const [currencies, setCurrencies] = useState<string[]>(['USD'])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCurrencies()
      .then(data => setCurrencies(data.length > 0 ? data : ['USD']))
      .catch(() => setCurrencies(['USD']))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ ...form, preferredCurrency })
      const { token, userId, isAdmin } = await login(form.username, form.password)
      setToken(token)
      setUserId(userId)
      setIsAdmin(isAdmin)
      const profile = await getUser()
      setPreferredCurrency(profile.preferredCurrency ?? 'USD')
      navigate('/profile')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('409') || msg.toLowerCase().includes('conflict')) {
        setError('User name or E-mail address already taken.')
      } else {
        setError('Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Register</h1>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred currency (optional)
            </label>
            <select
              value={preferredCurrency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
