import { Link } from 'react-router-dom'
import CarImage from '../assets/vw_golf_7.jpg'
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps'
/*import dotenv from 'dotenv'
dotenv.config()*/

const car = {
    id: 1,
    name: 'VW Golf 7',
    pricePerDay: 49,
    description: 'A reliable and fuel-efficient compact car, perfect for city driving and weekend getaways.'
}

type Poi ={ key: string, location: { lat: number; lng: number } }
const locations: Poi[] = [
    {key: 'rentalServiceHQ', location: { lat: 48.15783, lng: 16.38218  }}
];

const PoiMarkers = (props: {pois: Poi[]}) => {
    return (
        <>
            {props.pois.map( (poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}>
                    <Pin background={'#FF0000'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

function SingleCar() {
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
    console.log('GOOGLE_MAPS_API_KEY:', GOOGLE_MAPS_API_KEY);
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
            <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    defaultZoom={18}
                    defaultCenter={{ lat: 48.15783, lng: 16.38218 }} // HCW coordinates
                    style={{ width: '100%', height: '100%' }}
                    mapId="97c3ae73e48c926ea913c9dd"
                    onCameraChanged={() => console.log('Camera position changed')}
                />
                    <PoiMarkers pois={locations} />
                    </APIProvider>
            </div>
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
