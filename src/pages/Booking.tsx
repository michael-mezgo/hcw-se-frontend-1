import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CarResponse } from '../api/cars';
import { getCars } from '../api/cars';

const CarRentalPage: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<CarResponse | null>(null);
  const [cars, setCars] = useState<CarResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await getCars();
        setCars(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cars');
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      {loading && <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Loading cars...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '1.1rem' }}>Error: {error}</p>}
      
      {/* Car Grid */}
      {!loading && cars.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {cars.map(car => (
          <div key={car.id} style={cardStyle}>
            <img src={car.imageUrl} alt={car.model} style={imageStyle} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{car.manufacturer} {car.model}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Year: {car.year}</p>
              {/* UPDATED LABEL: "Book" */}
              <button onClick={() => setSelectedCar(car)} style={bookButtonStyle}>Book</button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* --- MODAL (Pop-up) --- */}
      {selectedCar && (
        <div style={overlayStyle} onClick={() => setSelectedCar(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCar(null)} style={closeButtonStyle}>✕</button>

            <div style={modalGridStyle}>
              <img src={selectedCar.imageUrl} alt={selectedCar.model} style={modalImageStyle} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  {/* UPDATED HEADER: "View Details" to orient the user */}
                  <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: '#2563eb', fontWeight: 'bold' }}>View Details</span>
                  <h1 style={{ margin: '5px 0 0 0' }}>{selectedCar.manufacturer} {selectedCar.model}</h1>
                  <span style={{ color: '#64748b' }}>Model Year {selectedCar.year}</span>
                </div>

                <div style={{ lineHeight: '1.6', color: '#444' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Description</strong>
                  <p style={{ marginTop: '8px' }}>{selectedCar.description}</p>
                </div>

                <div style={specGridStyle}>
                  <SpecItem label="Power" value={`${selectedCar.power} HP`} />
                  <SpecItem label="Fuel" value={selectedCar.fuelType} />
                  <SpecItem label="Transmission" value={selectedCar.transmission} />
                  <SpecItem label="Available" value={selectedCar.isAvailable ? 'Yes' : 'No'} />
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid #f1f5f9' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Daily rate</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>${selectedCar.pricePerDay}</div>
                      </div>
                      {/* The final CTA in the pop-up */}
                      <Link to={`/cars/${selectedCar.id}`}>View Details</Link>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles & Helper ---
const SpecItem = ({ label, value }: { label: string, value: string }) => (
  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>{label}</span>
    <span style={{ fontWeight: '600', color: '#334155' }}>{value}</span>
  </div>
);

const cardStyle: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const imageStyle: React.CSSProperties = { width: '100%', height: '220px', objectFit: 'cover' };
const bookButtonStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };

const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' };
const modalStyle: React.CSSProperties = { backgroundColor: 'white', width: '100%', maxWidth: '1100px', borderRadius: '24px', padding: '40px', position: 'relative', overflowY: 'auto', maxHeight: '90vh' };
const modalGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(400px, 1.3fr) 1fr', gap: '50px' };
const modalImageStyle: React.CSSProperties = { width: '100%', height: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '20px' };
const specGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };
const closeButtonStyle: React.CSSProperties = { position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' };

export default CarRentalPage;