import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { userId, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Car Rental</Link>
      <div className="flex gap-4 items-center">
        <Link to="/cars" className="text-gray-600 hover:text-gray-900 text-sm">
          Cars
        </Link>
        {userId ? (
          <>
            {isAdmin && (
              <Link to="/admin" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Admin
              </Link>
            )}
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 text-sm">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
