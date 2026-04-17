import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminCarDetail from "../../src/pages/admin/AdminCarDetail";

const mockCar = {
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
    cy.intercept("GET", "/cars/1", { body: mockCar }).as("getCar");
    mountWithRoute();
    cy.wait("@getCar");
  });

  it("renders manufacturer and model as heading", () => {
    cy.get("h1").should("contain.text", "BMW X5");
  });

  it("renders car ID", () => {
    cy.contains("Fahrzeug #1").should("exist");
  });

  it("renders link back to cars list", () => {
    cy.get("a[href='/admin/cars']").should("exist");
  });

  it("pre-fills manufacturer field", () => {
    cy.get("input").first().should("have.value", "BMW");
  });

  it("pre-fills model field", () => {
    cy.get("input").eq(1).should("have.value", "X5");
  });

  it("pre-fills image URL field", () => {
    cy.get('input[type="url"]').should(
      "have.value",
      "https://example.com/bmw.jpg"
    );
  });

  it("pre-fills transmission select", () => {
    cy.get("select").first().should("have.value", "AUTOMATIC");
  });

  it("pre-fills fuel type select", () => {
    cy.get("select").eq(1).should("have.value", "GASOLINE");
  });

  it("renders save button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Speichern");
  });

  it("renders delete button", () => {
    cy.contains("button", "Fahrzeug löschen").should("exist");
  });

  it("shows success message after saving", () => {
    cy.intercept("PATCH", "/cars/1", { body: { message: "Updated" } });
    cy.get('button[type="submit"]').click();
    cy.contains("Fahrzeug erfolgreich aktualisiert.").should("be.visible");
  });

  it("shows error message when save fails", () => {
    cy.intercept("PATCH", "/cars/1", { statusCode: 500, body: "Error" });
    cy.get('button[type="submit"]').click();
    cy.contains("Aktualisierung fehlgeschlagen.").should("be.visible");
  });

  it("disables submit button while saving", () => {
    cy.intercept("PATCH", "/cars/1", (req) => {
      req.reply({ delay: 500, body: { message: "Updated" } });
    });
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Speichert...")
      .and("be.disabled");
  });

  it("shows error when car not found", () => {
    cy.intercept("GET", "/cars/99", { statusCode: 404, body: "Not Found" });
    cy.mount(
      <MemoryRouter initialEntries={["/admin/cars/99"]}>
        <Routes>
          <Route path="/admin/cars/:id" element={<AdminCarDetail />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Fahrzeug nicht gefunden.").should("be.visible");
  });

  it("shows error when deletion fails", () => {
    cy.intercept("DELETE", "/cars/1", { statusCode: 500, body: "Error" });
    cy.on("window:confirm", () => true);
    cy.contains("button", "Fahrzeug löschen").click();
    cy.contains("Löschen fehlgeschlagen.").should("be.visible");
  });

  it("does not delete when confirm is cancelled", () => {
    cy.on("window:confirm", () => false);
    cy.contains("button", "Fahrzeug löschen").click();
    cy.get("h1").should("contain.text", "BMW X5");
  });
});
