import { Link } from 'react-router-dom'
import CarImage from '../assets/vw_golf_7.jpg'
const car = {
    id: 1,
    name: 'VW Golf 7',
    pricePerDay: 49,
    description: 'A reliable and fuel-efficient compact car, perfect for city driving and weekend getaways.'
}

function SingleCar() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{car.name}</h1>
            <p className="text-gray-600 mb-8">{car.pricePerDay} € / Day</p>
            <img src={CarImage} width={300} alt="VW Golf 7" />
            <h3>General information</h3>
            <h4>Year of manufacture: 2017</h4>
            <h4>Power: 150 HP</h4>
            <h4>Transmission: Manual</h4>
            <h4>Fuel type: Diesel</h4>
            <p className="text-gray-600 mt-8 mb-8">{car.description}</p>
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
