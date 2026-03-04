import { Link } from 'react-router-dom'

const cars = [
  { id: 1, name: 'VW Golf', pricePerDay: 49 },
  { id: 2, name: 'BMW 3er', pricePerDay: 89 },
  { id: 3, name: 'Mercedes C-Klasse', pricePerDay: 99 },
]

function Cars() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Fahrzeuge</h1>
      <ul className="w-full max-w-md space-y-4 mb-8">
        {cars.map((car) => (
          <li
            key={car.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <span className="font-medium text-gray-800">{car.name}</span>
            <span className="text-blue-600 font-semibold">{car.pricePerDay}€ / Tag</span>
          </li>
        ))}
      </ul>
      <Link
        to="/"
        className="text-gray-500 hover:text-gray-800 underline transition-colors"
      >
        Zurück zur Startseite
      </Link>
    </div>
  )
}

export default Cars
