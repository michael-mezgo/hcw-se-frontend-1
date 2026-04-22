import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { adminGetUser, adminUpdateUser, adminDeleteUser } from '../../api/admin'
import type { AdminUserProfile, AdminUpdateUserData } from '../../api/admin'
import { getCurrencies } from '../../api/currencies'

interface EditForm {
  email: string
  password: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
  isAdmin: boolean
  isLocked: boolean
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

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUserProfile | null>(null)
  const [form, setForm] = useState<EditForm>({
    email: '', password: '', firstName: '', lastName: '',
    licenseNumber: '', licenseValidUntil: '', isAdmin: false, isLocked: false,
    preferredCurrency: 'USD',
  })
  const [currencies, setCurrencies] = useState<string[]>(['USD'])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getCurrencies()
      .then(data => setCurrencies(data.length > 0 ? data : ['USD']))
      .catch(() => setCurrencies(['USD']))
  }, [])

  useEffect(() => {
    if (!id) return
    adminGetUser(Number(id))
      .then(u => {
        setUser(u)
        setForm({
          email: u.email,
          password: '',
          firstName: u.firstName,
          lastName: u.lastName,
          licenseNumber: u.licenseNumber,
          licenseValidUntil: u.licenseValidUntil,
          isAdmin: u.isAdmin,
          isLocked: u.isLocked,
          preferredCurrency: u.preferredCurrency ?? 'USD',
        })
      })
      .catch(() => setError('User not found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError('')
    setSuccess('')
    const data: AdminUpdateUserData = {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      licenseNumber: form.licenseNumber,
      licenseValidUntil: form.licenseValidUntil,
      isAdmin: form.isAdmin,
      isLocked: form.isLocked,
      preferredCurrency: form.preferredCurrency,
    }
    if (form.password) data.password = form.password
    try {
      await adminUpdateUser(Number(id), data)
      setSuccess('User updated successfully.')
      setForm(f => ({ ...f, password: '' }))
    } catch {
      setError('Update failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || !user) return
    if (!confirm(`Are you sure you want to delete User "${user.username}"?`)) return
    try {
      await adminDeleteUser(Number(id))
      navigate('/admin/users')
    } catch {
      setError('Deletion failed.')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!user) return <p className="text-red-500">{error || 'User not found.'}</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/users" className="text-slate-500 hover:text-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-sm text-gray-500">User #{user.id}</p>
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
            <input
              type={type}
              value={form[name] as string}
              onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        ))}

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Administrator</span>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isAdmin: !f.isAdmin }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isAdmin ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isAdmin ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Account locked</span>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isLocked: !f.isLocked }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isLocked ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isLocked ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Preferred currency</span>
            <select
              value={form.preferredCurrency}
              onChange={e => setForm(f => ({ ...f, preferredCurrency: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            Delete User
          </button>
        </div>
      </form>
    </div>
  )
}
