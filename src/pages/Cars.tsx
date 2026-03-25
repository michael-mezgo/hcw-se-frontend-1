import { Link } from 'react-router-dom'

const cars = [
  { id: 1, name: 'VW Golf 7', pricePerDay: 49 },
  { id: 2, name: '3 Series BMW', pricePerDay: 89 },
  { id: 3, name: 'Mercedes C-Class', pricePerDay: 99 },
]

function Cars() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Available Cars</h1>
      <ul className="w-full max-w-md space-y-4 mb-8">
        {cars.map((car) => (
          <li
            key={car.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
              <span className="font-medium text-gray-800">{ <Link to={`/cars/${car.id}`}>{car.name}</Link> }</span>
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
