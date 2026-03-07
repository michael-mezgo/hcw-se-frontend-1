import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { userId, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Car Rental</Link>
      <div className="flex gap-4 items-center">
        <Link to="/cars" className="text-gray-600 hover:text-gray-900 text-sm">
          Fahrzeuge
        </Link>
        {userId ? (
          <>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 text-sm">
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Abmelden
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">
              Anmelden
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Registrieren
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
