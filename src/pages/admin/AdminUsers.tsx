import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetUsers, adminDeleteUser, adminUpdateUser } from '../../api/admin'
import type { AdminUserProfile } from '../../api/admin'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)
      setUsers(await adminGetUsers())
    } catch {
      setError('Users could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleToggleLock(user: AdminUserProfile) {
    try {
      await adminUpdateUser(user.id, { isLocked: !user.isLocked })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: !u.isLocked } : u))
    } catch {
      setError('Action failed.')
    }
  }

  async function handleDelete(user: AdminUserProfile) {
    if (!confirm(`Are you sure you want to delete User "${user.username}"?`)) return
    try {
      await adminDeleteUser(user.id)
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch {
      setError('Deletion failed.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} Users in total</p>
        </div>
        <Link
          to="/admin/users/new"
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 text-sm font-medium"
        >
          + Add User
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link to={`/admin/users/${user.id}`} className="hover:text-slate-600 hover:underline">
                      {user.username}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {user.isAdmin && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                      {user.isLocked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="text-slate-600 hover:text-slate-900 text-xs px-2 py-1 rounded border border-gray-200 hover:border-gray-400"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleLock(user)}
                        className={`text-xs px-2 py-1 rounded border ${
                          user.isLocked
                            ? 'text-green-700 border-green-200 hover:border-green-400'
                            : 'text-orange-700 border-orange-200 hover:border-orange-400'
                        }`}
                      >
                        {user.isLocked ? 'Unlock' : 'Lock'}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
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
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">No Users found.</p>
          )}
        </div>
      )}
    </div>
  )
}
