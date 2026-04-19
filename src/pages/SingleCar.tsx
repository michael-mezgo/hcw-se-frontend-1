import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {getCar, type CarResponse, bookCar} from '../api/cars'
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps'

const GOOGLE_MAPS_API_KEY = (window as any).__env__?.GOOGLE_MAPS_API_KEY ?? ''

function parseErrorMessage(errorMessage: string): string {
  const match = errorMessage.match(/HTTP \d+: (.+)$/)
  if (match) {
    try {
      const errorData = JSON.parse(match[1])
      return errorData.error || match[1]
    } catch {
      return match[1]
    }
  }
  return errorMessage
}

function SingleCar() {
  const { id } = useParams<{ id: string }>()
  const [car, setCar] = useState<CarResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bookError, setBookError] = useState('')

  useEffect(() => {
    if (!id) return
    getCar(Number(id))
      .then(setCar)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleBookCar(carId: number) {
    setSuccess('')
    setBookError('')
    try {
      await bookCar(carId)
      console.log(`Car with ID ${carId} has been booked successfully.`)
      setSuccess(`Car with ID ${carId} has been booked successfully.`)
    } catch (err) {
      const cleanedError = parseErrorMessage(err.message)
      setBookError(`Failed to book car with ID ${carId}: ${cleanedError}`)
      console.log(`Failed to book car with ID ${carId}:`, err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading…</p>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">{error || 'Car not found'}</p>
        <Link to="/cars" className="text-blue-600 underline">Back to all Cars</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{car.manufacturer} {car.model}</h1>
      <p className="text-gray-600 mb-8">{car.pricePerDay} € / Day</p>
      {car.imageUrl && (
        <img src={car.imageUrl} width={300} alt={`${car.manufacturer} ${car.model}`} className="rounded-lg mb-6" />
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">General information</h3>
      <div className="text-gray-700 space-y-1 mb-6">
        <p>Year of manufacture: {car.year}</p>
        <p>Power: {car.power} HP</p>
        <p>Transmission: {car.transmission}</p>
        <p>Fuel type: {car.fuelType}</p>
        <p>Available: {car.isAvailable ? 'Yes' : 'No'}</p>
      </div>
      <p className="text-gray-600 mb-8">{car.description}</p>
      {car.location?.latitude != null && car.location?.longitude != null && (
        <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    defaultZoom={18}
                    defaultCenter={{ lat: car.location.latitude, lng: car.location.longitude }}
                    style={{ width: '100%', height: '100%' }}
                    mapId="97c3ae73e48c926ea913c9dd"
                >
                    <AdvancedMarker position={{ lat: car.location.latitude, lng: car.location.longitude }}>
                        <Pin background={'#FF0000'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </div>
      )}
        {/*{car.isAvailable && (*/}
        <button type="button" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" onClick={() => handleBookCar(car.id)}>Book this car</button>
        {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                {success}
            </div>
        )}
        {bookError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {bookError}
            </div>
        )}
        {/*)*/}
        {/*}*/}
      <Link
        to="/cars"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to all Cars
      </Link>
    </div>
  )
}

export default SingleCar
