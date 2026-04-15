import { MemoryRouter } from "react-router-dom";
import AdminCars from "../../src/pages/admin/AdminCars";

const mockCars = [
  {
    id: 1,
    manufacturer: "BMW",
    model: "X5",
    year: 2022,
    pricePerDay: 89.99,
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
    pricePerDay: 120.0,
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
    pricePerDay: 55.0,
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
    cy.intercept("GET", "/cars", { body: mockCars }).as("getCars");
    cy.mount(
      <MemoryRouter>
        <AdminCars />
      </MemoryRouter>
    );
    cy.wait("@getCars");
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Fahrzeugverwaltung");
  });

  it("shows total car count", () => {
    cy.contains("3 Fahrzeuge gesamt").should("exist");
  });

  it("renders link to create new car", () => {
    cy.get("a")
      .contains("+ Fahrzeug erstellen")
      .should("have.attr", "href", "/admin/cars/new");
  });

  it("renders all cars in table", () => {
    cy.contains("BMW X5").should("exist");
    cy.contains("Tesla Model 3").should("exist");
    cy.contains("VW Golf").should("exist");
  });

  it("shows Verfügbar badge for available cars", () => {
    cy.contains("tr", "BMW X5").contains("Verfügbar").should("exist");
  });

  it("shows Nicht verfügbar badge for unavailable cars", () => {
    cy.contains("tr", "Tesla Model 3")
      .contains("Nicht verfügbar")
      .should("exist");
  });

  it("shows correct transmission labels", () => {
    cy.contains("tr", "BMW X5").contains("Automatik").should("exist");
    cy.contains("tr", "VW Golf").contains("Manuell").should("exist");
  });

  it("shows correct fuel type labels", () => {
    cy.contains("tr", "BMW X5").contains("Benzin").should("exist");
    cy.contains("tr", "Tesla Model 3").contains("Elektro").should("exist");
    cy.contains("tr", "VW Golf").contains("Diesel").should("exist");
  });

  it("shows price per day", () => {
    cy.contains("tr", "BMW X5").contains("89.99 €").should("exist");
  });

  it("shows power in PS", () => {
    cy.contains("tr", "BMW X5").contains("250 PS").should("exist");
  });

  it("renders Bearbeiten link per car", () => {
    cy.contains("tr", "BMW X5")
      .contains("a", "Bearbeiten")
      .should("have.attr", "href", "/admin/cars/1");
  });

  it("removes car from list after deletion", () => {
    cy.intercept("DELETE", "/cars/1", { statusCode: 204 });
    cy.on("window:confirm", () => true);
    cy.contains("tr", "BMW X5").contains("button", "Löschen").click();
    cy.contains("BMW X5").should("not.exist");
  });

  it("keeps car in list when deletion is cancelled", () => {
    cy.on("window:confirm", () => false);
    cy.contains("tr", "BMW X5").contains("button", "Löschen").click();
    cy.contains("BMW X5").should("exist");
  });

  it("shows error when deletion fails", () => {
    cy.intercept("DELETE", "/cars/1", { statusCode: 500, body: "Error" });
    cy.on("window:confirm", () => true);
    cy.contains("tr", "BMW X5").contains("button", "Löschen").click();
    cy.contains("Löschen fehlgeschlagen.").should("be.visible");
  });

  it("shows error when loading cars fails", () => {
    cy.intercept("GET", "/cars", { statusCode: 500, body: "Error" });
    cy.mount(
      <MemoryRouter>
        <AdminCars />
      </MemoryRouter>
    );
    cy.contains("Fahrzeuge konnten nicht geladen werden.").should("be.visible");
  });

  it("shows empty state when no cars exist", () => {
    cy.intercept("GET", "/cars", { body: [] });
    cy.mount(
      <MemoryRouter>
        <AdminCars />
      </MemoryRouter>
    );
    cy.contains("Keine Fahrzeuge gefunden.").should("exist");
  });
});
