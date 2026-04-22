import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getCar, type CarResponse, bookCar } from '../api/cars'
import { useAuth } from '../context/AuthContext'
import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps'

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

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{label}</span>
    <span style={{ fontWeight: '600', color: '#334155' }}>{value}</span>
  </div>
)

function SingleCar() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { preferredCurrency } = useAuth()
  const [car, setCar] = useState<CarResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bookError, setBookError] = useState('')

  useEffect(() => {
    if (!id) return
    const currencyCode = searchParams.get('currency') ?? preferredCurrency
    getCar(Number(id), currencyCode)
      .then(setCar)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, searchParams, preferredCurrency])

  async function handleBookCar(carId: number) {
    setSuccess('')
    setBookError('')
    try {
      await bookCar(carId)
      setSuccess(`Car booked successfully.`)
    } catch (err) {
      const cleanedError = parseErrorMessage((err as Error).message)
      setBookError(`Booking failed: ${cleanedError}`)
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.3fr) 1fr', gap: '50px' }}>

          {/* Left: image + map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <img
              src={car.imageUrl}
              alt={`${car.manufacturer} ${car.model}`}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '20px' }}
            />
            {car.location?.latitude != null && car.location?.longitude != null && (
              <div style={{ width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden' }}>
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                  <Map
                    defaultZoom={15}
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
          </div>

          {/* Right: details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#2563eb', fontWeight: 'bold' }}>
                {car.isAvailable ? 'Available' : 'Not available'}
              </span>
              <h1 style={{ margin: '5px 0 0 0', fontSize: '2rem' }}>{car.manufacturer} {car.model}</h1>
              <span style={{ color: '#64748b' }}>Year of manucature: {car.year}</span>
            </div>

            <div style={{ lineHeight: '1.6', color: '#444' }}>
              <strong style={{ fontSize: '1.1rem' }}>Description</strong>
              <p style={{ marginTop: '8px' }}>{car.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <SpecItem label="Power" value={`${car.power} HP`} />
              <SpecItem label="Fuel type" value={car.fuelType} />
              <SpecItem label="Transmission" value={car.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'} />
              <SpecItem label="Available" value={car.isAvailable ? 'Yes' : 'No'} />
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Daily rate</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px' }}>{car.pricePerDay.amount.toFixed(2)} {car.pricePerDay.currencyCode}</div>

              {success && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {success}
                </div>
              )}
              {bookError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {bookError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleBookCar(car.id)}
                  disabled={!car.isAvailable}
                  style={{
                    flex: 1, padding: '14px', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: car.isAvailable ? 'pointer' : 'not-allowed',
                    backgroundColor: car.isAvailable ? '#16a34a' : '#94a3b8', color: 'white',
                  }}
                >
                  {car.isAvailable ? 'Book this car' : 'Not available'}
                </button>
                <button
                  onClick={() => window.close()}
                  style={{ padding: '14px 20px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SingleCar
