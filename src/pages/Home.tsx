import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Car Rental</h1>
      <p>Willkommen bei unserem Autovermietungs-Service.</p>
      <Link to="/cars">Alle Fahrzeuge ansehen</Link>
    </div>
  )
}

export default Home
