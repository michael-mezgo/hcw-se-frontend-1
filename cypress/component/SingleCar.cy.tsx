import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import SingleCar from "../../src/pages/SingleCar";

const mockCar = {
  id: 1,
  manufacturer: "BMW",
  model: "X5",
  year: 2022,
  pricePerDay: { amount: 89.99, currencyCode: "EUR" },
  description: "A luxury SUV for all occasions.",
  imageUrl: "https://example.com/bmw.jpg",
  transmission: "AUTOMATIC",
  power: 250,
  fuelType: "GASOLINE",
  isAvailable: true,
  location: { latitude: 48.1, longitude: 16.3 },
};

const mockUnavailableCar = {
  ...mockCar,
  id: 2,
  isAvailable: false,
  location: { latitude: 0, longitude: 0 },
};

function mountSingleCar(id = "1") {
  cy.mount(
    <MemoryRouter initialEntries={[`/cars/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/cars/:id" element={<SingleCar />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("SingleCar component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("when car loads successfully", () => {
    beforeEach(() => {
      localStorage.setItem("userId", "1");
      cy.intercept("GET", "/api/cars/1*", { body: mockCar }).as("getCar");
      mountSingleCar("1");
      cy.wait("@getCar");
    });

    it("renders car manufacturer and model", () => {
      cy.get("h1").should("contain.text", "BMW X5");
    });

    it("renders car description", () => {
      cy.contains("A luxury SUV for all occasions.").should("exist");
    });

    it("renders power spec", () => {
      cy.contains("250 HP").should("exist");
    });

    it("renders fuel type", () => {
      cy.contains("GASOLINE").should("exist");
    });

    it("renders daily rate", () => {
      cy.contains("89.99 EUR").should("exist");
    });

    it("renders Book this car button when available", () => {
      cy.contains("button", "Book this car").should("exist").and("not.be.disabled");
    });

    it("shows success message after booking", () => {
      cy.intercept("POST", "/api/bookings", { statusCode: 201, body: { carId: 1, bookedBy: {} } }).as("book");
      cy.contains("button", "Book this car").click();
      cy.wait("@book");
      cy.contains("Car booked successfully.").should("be.visible");
    });

    it("shows error message when booking fails", () => {
      cy.intercept("POST", "/api/bookings", {
        statusCode: 400,
        body: JSON.stringify({ error: "Car already booked" }),
      }).as("book");
      cy.contains("button", "Book this car").click();
      cy.wait("@book");
      cy.contains("Booking failed:").should("be.visible");
    });
  });

  describe("when car is not available", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/cars/2*", { body: mockUnavailableCar }).as("getCar");
      mountSingleCar("2");
      cy.wait("@getCar");
    });

    it("shows not available status", () => {
      cy.contains("Not available").should("exist");
    });

    it("disables the book button", () => {
      cy.contains("button", "Not available").should("be.disabled");
    });
  });

  it("shows loading state initially", () => {
    cy.intercept("GET", "/api/cars/1*", (req) => {
      req.reply({ delay: 500, body: mockCar });
    }).as("getCar");
    mountSingleCar("1");
    cy.contains("Loading").should("exist");
    cy.wait("@getCar");
  });

  it("shows error state when car fetch fails", () => {
    cy.intercept("GET", "/api/cars/1*", { statusCode: 404, body: "Not Found" }).as("getCar");
    mountSingleCar("1");
    cy.wait("@getCar");
    cy.get("a").should("contain.text", "Back to all Cars");
  });
});
