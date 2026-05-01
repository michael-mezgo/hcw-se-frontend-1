import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import CarRentalPage from "../../src/pages/Booking";

const mockCars = [
  {
    id: 1,
    manufacturer: "BMW",
    model: "X5",
    year: 2022,
    pricePerDay: { amount: 89.99, currencyCode: "EUR" },
    description: "Luxury SUV",
    imageUrl: "https://example.com/bmw.jpg",
    transmission: "AUTOMATIC",
    power: 250,
    fuelType: "GASOLINE",
    isAvailable: true,
    location: { latitude: 48.1, longitude: 16.3 },
  },
  {
    id: 2,
    manufacturer: "Tesla",
    model: "Model 3",
    year: 2023,
    pricePerDay: { amount: 120.0, currencyCode: "EUR" },
    description: "Electric sedan",
    imageUrl: "https://example.com/tesla.jpg",
    transmission: "AUTOMATIC",
    power: 350,
    fuelType: "ELECTRIC",
    isAvailable: false,
    location: { latitude: 48.2, longitude: 16.4 },
  },
];

function mountBooking() {
  cy.mount(
    <MemoryRouter>
      <AuthProvider>
        <CarRentalPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Booking (CarRentalPage) component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the available-only filter button", () => {
    cy.intercept("GET", "/cars*", { body: mockCars }).as("getCars");
    mountBooking();
    cy.wait("@getCars");
    cy.contains("button", "Available only").should("exist");
  });

  it("renders car cards after loading", () => {
    cy.intercept("GET", "/cars*", { body: mockCars }).as("getCars");
    mountBooking();
    cy.wait("@getCars");
    cy.contains("BMW X5").should("exist");
    cy.contains("Tesla Model 3").should("exist");
  });

  it("renders View Details link for each car", () => {
    cy.intercept("GET", "/cars*", { body: [mockCars[0]] }).as("getCars");
    mountBooking();
    cy.wait("@getCars");
    cy.contains("a", "View Details").should("exist");
  });

  it("shows Not available badge for unavailable cars", () => {
    cy.intercept("GET", "/cars*", { body: mockCars }).as("getCars");
    mountBooking();
    cy.wait("@getCars");
    cy.contains("Not available").should("exist");
  });

  it("shows loading state while fetching", () => {
    cy.intercept("GET", "/cars*", (req) => {
      req.reply({ delay: 500, body: mockCars });
    }).as("getCars");
    mountBooking();
    cy.contains("Loading cars...").should("exist");
    cy.wait("@getCars");
  });

  it("shows error state when fetch fails", () => {
    cy.intercept("GET", "/cars*", { statusCode: 500, body: "Error" }).as("getCars");
    mountBooking();
    cy.wait("@getCars");
    cy.contains("Error:").should("exist");
  });

  it("shows all cars (including unavailable) after toggling filter", () => {
    cy.intercept("GET", "/cars?available=true", { body: [mockCars[0]] }).as("availableOnly");
    mountBooking();
    cy.wait("@availableOnly");
    cy.intercept("GET", "/cars", { body: mockCars }).as("allCars");
    cy.contains("button", "Available only").click();
    cy.wait("@allCars");
    cy.contains("Show available only").should("exist");
    cy.contains("BMW X5").should("exist");
    cy.contains("Tesla Model 3").should("exist");
  });

  it("shows no cars when list is empty", () => {
    cy.intercept("GET", "/cars*", { body: [] }).as("getCars");
    mountBooking();
    cy.wait("@getCars");
    cy.contains("Loading cars...").should("not.exist");
    cy.get("h3").should("not.exist");
  });
});
