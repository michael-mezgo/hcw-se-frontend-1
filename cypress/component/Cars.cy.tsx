import { MemoryRouter } from "react-router-dom";
import Cars from "../../src/pages/Cars";
import type { CarResponse } from "../../src/api/cars";

const mockCars: CarResponse[] = [
  {
    id: 1,
    manufacturer: "VW",
    model: "Golf",
    year: 2022,
    pricePerDay: 49,
    description: "",
    imageUrl: "",
    transmission: "MANUAL",
    power: 110,
    fuelType: "GASOLINE",
    isAvailable: true,
    location: { latitude: 0, longitude: 0 },
  },
  {
    id: 2,
    manufacturer: "BMW",
    model: "3er",
    year: 2023,
    pricePerDay: 89,
    description: "",
    imageUrl: "",
    transmission: "AUTOMATIC",
    power: 190,
    fuelType: "DIESEL",
    isAvailable: true,
    location: { latitude: 0, longitude: 0 },
  },
  {
    id: 3,
    manufacturer: "Mercedes",
    model: "C-Klasse",
    year: 2023,
    pricePerDay: 99,
    description: "",
    imageUrl: "",
    transmission: "AUTOMATIC",
    power: 200,
    fuelType: "GASOLINE",
    isAvailable: false,
    location: { latitude: 0, longitude: 0 },
  },
];

describe("Cars component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/cars", { body: mockCars }).as("getCars");
    cy.mount(
      <MemoryRouter>
        <Cars />
      </MemoryRouter>
    );
    cy.wait("@getCars");
  });

  it("renders the heading", () => {
    cy.get("h1").should("contain.text", "Available Cars");
  });

  it("renders exactly 3 cars", () => {
    cy.get("li").should("have.length", 3);
  });

  it("renders VW Golf with price", () => {
    cy.contains("li", "VW Golf").should("contain.text", "49");
  });

  it("renders BMW 3er with price", () => {
    cy.contains("li", "BMW 3er").should("contain.text", "89");
  });

  it("renders Mercedes C-Klasse with price", () => {
    cy.contains("li", "Mercedes C-Klasse").should("contain.text", "99");
  });

  it("renders link back to home with correct href", () => {
    cy.get("a")
      .filter('[href="/"]')
      .should("contain.text", "Back to Home");
  });

  it("shows loading state before response", () => {
    cy.intercept("GET", "/cars", { delay: 500, body: [] }).as("getCarsDelayed");
    cy.mount(
      <MemoryRouter>
        <Cars />
      </MemoryRouter>
    );
    cy.contains("Loading cars").should("exist");
    cy.wait("@getCarsDelayed");
  });

  it("shows error message when API fails", () => {
    cy.intercept("GET", "/cars", { statusCode: 500, body: "Internal Server Error" }).as("getCarsError");
    cy.mount(
      <MemoryRouter>
        <Cars />
      </MemoryRouter>
    );
    cy.wait("@getCarsError");
    cy.contains("HTTP 500").should("exist");
  });
});
