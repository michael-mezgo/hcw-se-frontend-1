import './App.css'
import carPlaceholder from './assets/car_placeholder.png'

function App() {

    function displayCars(numberOfCars: number) {
        const cars: JSX.Element[] = [];
        for (let i = 0; i < numberOfCars; i++) {
            cars.push(
                    <div className="car-details">
                        <div className="car-details-text">
                            <h3>Car {i + 1}</h3>

                            <p>Brand: {i + 1}</p>

                            <p>Model: {i + 1}</p>

                            <p>Year of manufacture: {i + 1}</p>

                            <p>Price: {i + 1}</p>
                        </div>
                        <div className="car-image">
                            <img src={carPlaceholder} width={300} alt="Placeholder car image" />
                        </div>
                    </div>
            )
        }
        return (
            <div className="car-list">
                {cars}
            </div>
        )
    }

    return (
        <>
            <div
                className="browse-cars-header"
                style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem', paddingBottom: '0.5rem' }}
            >
                <h2>Browse Cars</h2>
            </div>
            {displayCars(10)}
        </>
    )
}

export default App
