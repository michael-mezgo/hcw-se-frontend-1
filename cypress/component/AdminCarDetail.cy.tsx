import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminCarDetail from "../../src/pages/admin/AdminCarDetail";

const mockCar = {
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
};

function mountWithRoute() {
  cy.mount(
    <MemoryRouter initialEntries={["/admin/cars/1"]}>
      <Routes>
        <Route path="/admin/cars/:id" element={<AdminCarDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminCarDetail component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/cars/1", { body: mockCar }).as("getCar");
    mountWithRoute();
    cy.wait("@getCar");
  });

  it("renders manufacturer and model as heading", () => {
    cy.get("h1").should("contain.text", "BMW X5");
  });

  it("renders car ID", () => {
    cy.contains("Car #1").should("exist");
  });

  it("renders link back to cars list", () => {
    cy.get("a[href='/admin/cars']").should("exist");
  });

  it("pre-fills manufacturer field", () => {
    cy.contains("label", "Manufacturer").next("input").should("have.value", "BMW");
  });

  it("pre-fills model field", () => {
    cy.contains("label", "Model").next("input").should("have.value", "X5");
  });

  it("pre-fills transmission select", () => {
    cy.get("select").first().should("have.value", "AUTOMATIC");
  });

  it("pre-fills fuel type select", () => {
    cy.get("select").eq(1).should("have.value", "GASOLINE");
  });

  it("renders save button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Save");
  });

  it("renders delete button", () => {
    cy.contains("button", "Delete Car").should("exist");
  });

  it("shows success message after saving", () => {
    cy.intercept("PATCH", "/api/cars/1", { body: { message: "Updated" } });
    cy.get('button[type="submit"]').click();
    cy.contains("Car updated successfully.").should("be.visible");
  });

  it("shows error message when save fails", () => {
    cy.intercept("PATCH", "/api/cars/1", { statusCode: 500, body: "Error" });
    cy.get('button[type="submit"]').click();
    cy.contains("Update failed.").should("be.visible");
  });

  it("disables submit button while saving", () => {
    cy.intercept("PATCH", "/api/cars/1", (req) => {
      req.reply({ delay: 500, body: { message: "Updated" } });
    });
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Saving...")
      .and("be.disabled");
  });

  it("shows error when car not found", () => {
    cy.intercept("GET", "/api/cars/99", { statusCode: 404, body: "Not Found" });
    cy.mount(
      <MemoryRouter initialEntries={["/admin/cars/99"]}>
        <Routes>
          <Route path="/admin/cars/:id" element={<AdminCarDetail />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Car not found.").should("be.visible");
  });

  it("shows error when deletion fails", () => {
    cy.intercept("DELETE", "/api/cars/1", { statusCode: 500, body: "Error" });
    cy.on("window:confirm", () => true);
    cy.contains("button", "Delete Car").click();
    cy.contains("Deletion failed.").should("be.visible");
  });

  it("does not delete when confirm is cancelled", () => {
    cy.on("window:confirm", () => false);
    cy.contains("button", "Delete Car").click();
    cy.get("h1").should("contain.text", "BMW X5");
  });
});
