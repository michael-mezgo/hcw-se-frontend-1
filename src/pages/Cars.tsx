import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCars, type CarResponse } from '../api/cars'
import { apiFetch } from '../api/client'

function Cars() {
  const [cars, setCars] = useState<CarResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currencies, setCurrencies] = useState<string[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')
  const [rate, setRate] = useState(1)

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    apiFetch<string[]>('http://localhost:8080/currency-service')
      .then(setCurrencies)
      .catch((err) => console.error('Failed to load currencies:', err))
  }, [])

  useEffect(() => {
    if (selectedCurrency !== 'EUR') {
      apiFetch<number>(`http://localhost:8080/exchange-rate?from=EUR&to=${selectedCurrency}`)
        .then(setRate)
        .catch((err) => {
          console.error('Failed to load exchange rate:', err)
          setRate(1) // Fallback to 1 if error
        })
    } else {
      setRate(1)
    }
  }, [selectedCurrency])

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
      <div className="mb-4">
        <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Currency:
        </label>
        <select
          id="currency-select"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="EUR">EUR</option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <ul className="w-full max-w-md space-y-4 mb-8">
        {cars.map((car) => (
          <li
            key={car.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <span className="font-medium text-gray-800">
              <Link to={`/cars/${car.id}`}>{car.manufacturer} {car.model}</Link>
            </span>
            <span className="text-blue-600 font-semibold">{(car.pricePerDay * rate).toFixed(2)} {selectedCurrency} / Day</span>
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