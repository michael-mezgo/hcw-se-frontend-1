import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { userId } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Car Rental</h1>
      <p className="text-gray-600 mb-8">Welcome to our Car Rental Service.</p>
      <div className="flex gap-4">
        <Link
          to="/cars?currency=EUR"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors browse-cars"
        >
          Browse cars
        </Link>
        {!userId && (
          <Link
            to="/register"
            className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register now
          </Link>
        )}
      </div>
    </div>
  )
}

export default Home
