import React, { useState, useEffect } from 'react';
import type { CarResponse } from '../api/cars';
import { getCars } from '../api/cars';

const CarRentalPage: React.FC = () => {
  const [cars, setCars] = useState<CarResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await getCars(availableOnly);
        if(!availableOnly)
        {
          const sorted = [...data].sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));
          setCars(sorted);
        }
        else
        {
          setCars(data);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cars');
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [availableOnly]);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button
          onClick={() => setAvailableOnly(v => !v)}
          style={{
            padding: '10px 18px', borderRadius: '10px', border: '2px solid',
            borderColor: availableOnly ? '#16a34a' : '#cbd5e1',
            backgroundColor: availableOnly ? '#f0fdf4' : 'white',
            color: availableOnly ? '#16a34a' : '#64748b',
            fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem',
          }}
        >
          {availableOnly ? '✓ Available only' : 'Show available only'}
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Loading cars...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '1.1rem' }}>Error: {error}</p>}

      {/* Car Grid */}
      {!loading && cars.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {cars.map(car => (
            <div key={car.id} style={car.isAvailable ? cardStyle : { ...cardStyle, opacity: 0.6 }}>
              <img src={car.imageUrl} alt={car.model} style={imageStyle} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{car.manufacturer} {car.model}</h3>
                  {!car.isAvailable && (
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      Not available
                    </span>
                  )}
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Year of manufacture: {car.year}</p>
                <a href={`/cars/${car.id}`} target="_blank" rel="noopener noreferrer" style={bookButtonStyle}>
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const cardStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const imageStyle: React.CSSProperties = { width: '100%', height: '220px', objectFit: 'cover' };
const bookButtonStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '12px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' };

export default CarRentalPage;
