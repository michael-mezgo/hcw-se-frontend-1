import { MemoryRouter } from "react-router-dom";
import AdminCars from "../../src/pages/admin/AdminCars";

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
    imageUrl: "",
    transmission: "AUTOMATIC",
    power: 350,
    fuelType: "ELECTRIC",
    isAvailable: false,
    location: { latitude: 48.2, longitude: 16.4 },
  },
  {
    id: 3,
    manufacturer: "VW",
    model: "Golf",
    year: 2021,
    pricePerDay: { amount: 55.0, currencyCode: "EUR" },
    description: "Compact car",
    imageUrl: "",
    transmission: "MANUAL",
    power: 130,
    fuelType: "DIESEL",
    isAvailable: true,
    location: { latitude: 48.3, longitude: 16.5 },
  },
];

describe("AdminCars component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/cars", { body: mockCars }).as("getCars");
    cy.mount(
      <MemoryRouter>
        <AdminCars />
      </MemoryRouter>
    );
    cy.wait("@getCars");
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Car management");
  });

  it("shows total car count", () => {
    cy.contains("3 Cars in total").should("exist");
  });

  it("renders link to create new car", () => {
    cy.get("a")
      .contains("+ Add Car")
      .should("have.attr", "href", "/admin/cars/new");
  });

  it("renders all cars in table", () => {
    cy.contains("BMW X5").should("exist");
    cy.contains("Tesla Model 3").should("exist");
    cy.contains("VW Golf").should("exist");
  });

  it("shows Available badge for available cars", () => {
    cy.contains("tr", "BMW X5").contains("Available").should("exist");
  });

  it("shows Not available badge for unavailable cars", () => {
    cy.contains("tr", "Tesla Model 3")
      .contains("Not available")
      .should("exist");
  });

  it("shows correct transmission labels", () => {
    cy.contains("tr", "BMW X5").contains("Automatic").should("exist");
    cy.contains("tr", "VW Golf").contains("Manual").should("exist");
  });

  it("shows correct fuel type labels", () => {
    cy.contains("tr", "BMW X5").contains("Gasoline").should("exist");
    cy.contains("tr", "Tesla Model 3").contains("Electric").should("exist");
    cy.contains("tr", "VW Golf").contains("Diesel").should("exist");
  });

  it("shows price per day", () => {
    cy.contains("tr", "BMW X5").contains("89.99 EUR").should("exist");
  });

  it("shows power in HP", () => {
    cy.contains("tr", "BMW X5").contains("250 HP").should("exist");
  });

  it("renders Edit link per car", () => {
    cy.contains("tr", "BMW X5")
      .contains("a", "Edit")
      .should("have.attr", "href", "/admin/cars/1");
  });

  it("removes car from list after deletion", () => {
    cy.intercept("DELETE", "/api/cars/1", { statusCode: 204 });
    cy.on("window:confirm", () => true);
    cy.contains("tr", "BMW X5").contains("button", "Delete").click();
    cy.contains("BMW X5").should("not.exist");
  });

  it("keeps car in list when deletion is cancelled", () => {
    cy.on("window:confirm", () => false);
    cy.contains("tr", "BMW X5").contains("button", "Delete").click();
    cy.contains("BMW X5").should("exist");
  });

  it("shows error when deletion fails", () => {
    cy.intercept("DELETE", "/api/cars/1", { statusCode: 500, body: "Error" });
    cy.on("window:confirm", () => true);
    cy.contains("tr", "BMW X5").contains("button", "Delete").click();
    cy.contains("Deletion failed.").should("be.visible");
  });

  it("shows error when loading cars fails", () => {
    cy.intercept("GET", "/api/cars", { statusCode: 500, body: "Error" });
    cy.mount(
      <MemoryRouter>
        <AdminCars />
      </MemoryRouter>
    );
    cy.contains("Cars could not be loaded.").should("be.visible");
  });

  it("shows empty state when no cars exist", () => {
    cy.intercept("GET", "/api/cars", { body: [] });
    cy.mount(
      <MemoryRouter>
        <AdminCars />
      </MemoryRouter>
    );
    cy.contains("No Cars found.").should("exist");
  });
});
