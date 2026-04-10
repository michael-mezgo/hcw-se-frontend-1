import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCars, type CarResponse } from '../api/cars'

function Cars() {
  const [cars, setCars] = useState<CarResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading cars…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Available Cars</h1>
      <ul className="w-full max-w-md space-y-4 mb-8">
        {cars.map((car) => (
          <li
            key={car.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <span className="font-medium text-gray-800">
              <Link to={`/cars/${car.id}`}>{car.manufacturer} {car.model}</Link>
            </span>
            <span className="text-blue-600 font-semibold">{car.pricePerDay}€ / Day</span>
          </li>
        ))}
      </ul>
      <Link
        to="/"
        className="text-gray-500 hover:text-gray-800 underline transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default Cars
