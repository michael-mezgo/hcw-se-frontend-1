import { MemoryRouter } from "react-router-dom";
import AdminCreateCar from "../../src/pages/admin/AdminCreateCar";

function fillForm() {
  cy.contains("label", "Manufacturer").next("input").type("BMW");
  cy.contains("label", "Model").next("input").type("X5");
  cy.contains("label", "Year of manufacture").next("input").type("2022");
  cy.contains("label", "Power (HP)").next("input").type("250");
  cy.contains("label", "Price per Day ($)").next("input").type("89.99");
  cy.contains("label", "Description").next("textarea").type("Luxury SUV");
  cy.contains("label", "Latitude").next("input").type("48.1");
  cy.contains("label", "Longitude").next("input").type("16.3");
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
    cy.get("h1").should("contain.text", "New Car");
  });

  it("renders link back to cars list", () => {
    cy.get("a[href='/admin/cars']").should("exist");
  });

  it("renders all required field labels", () => {
    cy.contains("Manufacturer").should("exist");
    cy.contains("Model").should("exist");
    cy.contains("Year of manufacture").should("exist");
    cy.contains("Power (HP)").should("exist");
    cy.contains("Price per Day ($)").should("exist");
    cy.contains("Description").should("exist");
    cy.contains("Transmission").should("exist");
    cy.contains("Fuel type").should("exist");
    cy.contains("Latitude").should("exist");
    cy.contains("Longitude").should("exist");
  });

  it("renders submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Create");
  });

  it("renders Cancel link", () => {
    cy.get("a").contains("Cancel").should("have.attr", "href", "/admin/cars");
  });

  it("renders image upload area", () => {
    cy.contains("Car image").should("exist");
    cy.contains("Select image (optional)").should("exist");
  });

  it("renders transmission options", () => {
    cy.get("select").first().within(() => {
      cy.contains("Automatic").should("exist");
      cy.contains("Manual").should("exist");
    });
  });

  it("renders fuel type options", () => {
    cy.get("select").eq(1).within(() => {
      cy.contains("Gasoline").should("exist");
      cy.contains("Diesel").should("exist");
      cy.contains("Electric").should("exist");
      cy.contains("Hybrid").should("exist");
    });
  });

  it("shows error on failed submission", () => {
    cy.intercept("POST", "/api/cars", { statusCode: 500, body: "Error" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Creation failed.").should("be.visible");
  });

  it("disables submit button while creating", () => {
    cy.intercept("POST", "/api/cars", (req) => {
      req.reply({ delay: 500, body: { id: 42 } });
    });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Creating...")
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

  it("shows Remove button after file selection", () => {
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake-image-content"),
        fileName: "test-car.jpg",
        mimeType: "image/jpeg",
      },
      { force: true }
    );
    cy.contains("button", "Remove").should("exist");
  });

  it("removes file preview after clicking Remove", () => {
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake-image-content"),
        fileName: "test-car.jpg",
        mimeType: "image/jpeg",
      },
      { force: true }
    );
    cy.contains("button", "Remove").click();
    cy.contains("test-car.jpg").should("not.exist");
    cy.contains("Select image (optional)").should("exist");
  });
});
