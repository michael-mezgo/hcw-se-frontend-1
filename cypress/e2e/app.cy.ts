const mockCars = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  manufacturer: `Brand${i + 1}`,
  model: `Model${i + 1}`,
  year: 2020 + i,
  pricePerDay: 50 + i * 5,
  description: `Description for car ${i + 1}`,
  imageUrl: "",
  transmission: "AUTOMATIC",
  power: 100 + i * 10,
  fuelType: "GASOLINE",
  isAvailable: true,
  location: { latitude: 48.0, longitude: 16.0 },
}));

describe("Home page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/cars*", { body: mockCars }).as("getCars");
    cy.visit("/");
  });

  it("displays the Browse Cars link", () => {
    cy.get("a.browse-cars").should("contain.text", "Browse cars");
  });

  it("navigates to the car list on click", () => {
    cy.get("a.browse-cars").click();
    cy.wait("@getCars");
    cy.get("h3").should("exist");
  });

  it("displays 10 car entries", () => {
    cy.get("a.browse-cars").click();
    cy.wait("@getCars");
    cy.get("h3").should("have.length", 10);
  });

  it("displays manufacturer and model for each car", () => {
    cy.get("a.browse-cars").click();
    cy.wait("@getCars");
    cy.get("h3").first().should("contain.text", "Brand1").and("contain.text", "Model1");
    cy.get("h3").last().should("contain.text", "Brand10").and("contain.text", "Model10");
  });

  it("displays year of manufacture for each car", () => {
    cy.get("a.browse-cars").click();
    cy.wait("@getCars");
    cy.get("h3").first().parent().should("contain.text", "Year of manufacture: 2020");
  });
});
