import { Link } from 'react-router-dom'

const cars = [
  { id: 1, name: 'VW Golf', pricePerDay: 49 },
  { id: 2, name: 'BMW 3er', pricePerDay: 89 },
  { id: 3, name: 'Mercedes C-Klasse', pricePerDay: 99 },
]

function Cars() {
  return (
    <div>
      <h1>Fahrzeuge</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.name} – {car.pricePerDay}€ / Tag
          </li>
        ))}
      </ul>
      <Link to="/">Zurück zur Startseite</Link>
    </div>
  )
}

export default Cars
