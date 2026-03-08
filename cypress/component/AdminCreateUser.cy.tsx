import { MemoryRouter } from "react-router-dom";
import AdminCreateUser from "../../src/pages/admin/AdminCreateUser";

function fillForm() {
  cy.get("input").eq(0).type("newuser");
  cy.get("input").eq(1).type("new@example.com");
  cy.get("input").eq(2).type("password123");
  cy.get("input").eq(3).type("John");
  cy.get("input").eq(4).type("Doe");
  cy.get("input").eq(5).type("L123456");
  cy.get("input").eq(6).type("2030-01-01");
}

describe("AdminCreateUser component", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <AdminCreateUser />
      </MemoryRouter>
    );
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Neuer Benutzer");
  });

  it("renders link back to users list", () => {
    cy.get("a[href='/admin/users']").should("exist");
  });

  it("renders all required field labels", () => {
    cy.contains("Benutzername").should("exist");
    cy.contains("E-Mail").should("exist");
    cy.contains("Passwort").should("exist");
    cy.contains("Vorname").should("exist");
    cy.contains("Nachname").should("exist");
    cy.contains("Führerscheinnummer").should("exist");
    cy.contains("Führerschein gültig bis").should("exist");
  });

  it("renders submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Erstellen");
  });

  it("renders Abbrechen link", () => {
    cy.get("a").contains("Abbrechen").should("have.attr", "href", "/admin/users");
  });

  it("renders admin toggle", () => {
    cy.contains("Administrator").should("exist");
  });

  it("shows error on duplicate user (409)", () => {
    cy.intercept("POST", "/admin/users", { statusCode: 409, body: "" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Benutzername oder E-Mail bereits vergeben.").should("be.visible");
  });

  it("shows generic error on failure", () => {
    cy.intercept("POST", "/admin/users", { statusCode: 500, body: "Server Error" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Erstellen fehlgeschlagen.").should("be.visible");
  });

  it("disables submit button while creating", () => {
    cy.intercept("POST", "/admin/users", (req) => {
      req.reply({ delay: 500, body: { id: 10 } });
    });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Erstellt...")
      .and("be.disabled");
  });
});
