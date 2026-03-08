import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Car Rental</h1>
      <p className="text-gray-600 mb-8">Welcome to our Car Rental Service.</p>
      <Link
        to="/cars"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View all Cars
      </Link>
    </div>
  )
}

export default Home
