import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminCreateUser } from '../../api/admin'
import type { CreateUserData } from '../../api/admin'

interface CreateForm {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  licenseNumber: string
  licenseValidUntil: string
  isAdmin: boolean
}

const TEXT_FIELDS: { name: keyof CreateForm; label: string; type?: string; required?: boolean }[] = [
  { name: 'username', label: 'User name', required: true },
  { name: 'email', label: 'E-mail', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  { name: 'firstName', label: 'First name', required: true },
  { name: 'lastName', label: 'Last name', required: true },
  { name: 'licenseNumber', label: 'License number', required: true },
  { name: 'licenseValidUntil', label: 'License valid until', type: 'date', required: true },
]

export default function AdminCreateUser() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CreateForm>({
    username: '', email: '', password: '', firstName: '',
    lastName: '', licenseNumber: '', licenseValidUntil: '', isAdmin: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data: CreateUserData = { ...form }
    try {
      const { id } = await adminCreateUser(data)
      navigate(`/admin/users/${id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('409') ? 'User name or E-mail address already taken.' : 'Creation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/users" className="text-slate-500 hover:text-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New User</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        {TEXT_FIELDS.map(({ name, label, type = 'text', required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={type}
              value={form[name] as string}
              onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
              required={required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        ))}

        <div className="border-t border-gray-100 pt-4">
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
            to="/admin/users"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
