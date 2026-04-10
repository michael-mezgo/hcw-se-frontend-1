import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCar, type CarResponse } from '../api/cars'
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

function SingleCar() {
  const { id } = useParams<{ id: string }>()
  const [car, setCar] = useState<CarResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getCar(Number(id))
      .then(setCar)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])



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
