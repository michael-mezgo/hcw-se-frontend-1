import './App.css'
import carPlaceholder from './assets/car_placeholder.png'

function App() {

    function displayCars(numberOfCars: number) {
        const cars = [];
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
                            <img src={carPlaceholder} width={300} alt="car_placeholder"/>
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
            <h2>Browse Cars</h2>
            <hr/>
            <br/>
            {displayCars(10)}
        </>
    )
}

export default App
