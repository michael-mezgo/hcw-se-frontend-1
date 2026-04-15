import { MemoryRouter } from "react-router-dom";
import AdminCreateCar from "../../src/pages/admin/AdminCreateCar";

function fillForm() {
  cy.contains("label", "Hersteller").next("input").type("BMW");
  cy.contains("label", "Modell").next("input").type("X5");
  cy.contains("label", "Baujahr").next("input").type("2022");
  cy.contains("label", "Leistung (PS)").next("input").type("250");
  cy.contains("label", "Preis pro Tag (€)").next("input").type("89.99");
  cy.contains("label", "Beschreibung").next("textarea").type("Luxury SUV");
  cy.contains("label", "Breitengrad").next("input").type("48.1");
  cy.contains("label", "Längengrad").next("input").type("16.3");
}

describe("AdminCreateCar component", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <AdminCreateCar />
      </MemoryRouter>
    );
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Neues Fahrzeug");
  });

  it("renders link back to cars list", () => {
    cy.get("a[href='/admin/cars']").should("exist");
  });

  it("renders all required field labels", () => {
    cy.contains("Hersteller").should("exist");
    cy.contains("Modell").should("exist");
    cy.contains("Baujahr").should("exist");
    cy.contains("Leistung (PS)").should("exist");
    cy.contains("Preis pro Tag (€)").should("exist");
    cy.contains("Beschreibung").should("exist");
    cy.contains("Getriebe").should("exist");
    cy.contains("Kraftstoff").should("exist");
    cy.contains("Breitengrad").should("exist");
    cy.contains("Längengrad").should("exist");
  });

  it("renders submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Erstellen");
  });

  it("renders Abbrechen link", () => {
    cy.get("a").contains("Abbrechen").should("have.attr", "href", "/admin/cars");
  });

  it("renders image upload area", () => {
    cy.contains("Fahrzeugbild").should("exist");
    cy.contains("Bild auswählen (optional)").should("exist");
  });

  it("renders transmission options", () => {
    cy.get("select").first().within(() => {
      cy.contains("Automatik").should("exist");
      cy.contains("Manuell").should("exist");
    });
  });

  it("renders fuel type options", () => {
    cy.get("select").eq(1).within(() => {
      cy.contains("Benzin").should("exist");
      cy.contains("Diesel").should("exist");
      cy.contains("Elektro").should("exist");
      cy.contains("Hybrid").should("exist");
    });
  });

  it("shows error on failed submission", () => {
    cy.intercept("POST", "/cars", { statusCode: 500, body: "Error" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Erstellen fehlgeschlagen.").should("be.visible");
  });

  it("disables submit button while creating", () => {
    cy.intercept("POST", "/cars", (req) => {
      req.reply({ delay: 500, body: { id: 42 } });
    });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Erstellt...")
      .and("be.disabled");
  });

  it("shows image preview filename after file selection", () => {
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake-image-content"),
        fileName: "test-car.jpg",
        mimeType: "image/jpeg",
      },
      { force: true }
    );
    cy.contains("test-car.jpg").should("exist");
  });

  it("shows Entfernen button after file selection", () => {
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake-image-content"),
        fileName: "test-car.jpg",
        mimeType: "image/jpeg",
      },
      { force: true }
    );
    cy.contains("button", "Entfernen").should("exist");
  });

  it("removes file preview after clicking Entfernen", () => {
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake-image-content"),
        fileName: "test-car.jpg",
        mimeType: "image/jpeg",
      },
      { force: true }
    );
    cy.contains("button", "Entfernen").click();
    cy.contains("test-car.jpg").should("not.exist");
    cy.contains("Bild auswählen (optional)").should("exist");
  });
});
