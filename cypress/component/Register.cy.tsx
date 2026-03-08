import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import Register from "../../src/pages/Register";

function fillForm() {
  cy.get('input[name="username"]').type("newuser");
  cy.get('input[name="email"]').type("new@example.com");
  cy.get('input[name="password"]').type("password123");
  cy.get('input[name="firstName"]').type("John");
  cy.get('input[name="lastName"]').type("Doe");
  cy.get('input[name="licenseNumber"]').type("L123456");
  cy.get('input[name="licenseValidUntil"]').type("2030-01-01");
}

describe("Register component", () => {
  beforeEach(() => {
    localStorage.clear();
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Registrieren");
  });

  it("renders all required fields", () => {
    cy.contains("label", "Benutzername").should("exist");
    cy.contains("label", "E-Mail").should("exist");
    cy.contains("label", "Passwort").should("exist");
    cy.contains("label", "Vorname").should("exist");
    cy.contains("label", "Nachname").should("exist");
    cy.contains("label", "Führerscheinnummer").should("exist");
    cy.contains("label", "Führerschein gültig bis").should("exist");
  });

  it("renders submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Konto erstellen");
  });

  it("renders link to login page", () => {
    cy.get("a")
      .should("contain.text", "Anmelden")
      .and("have.attr", "href", "/login");
  });

  it("shows error on conflict (username or email already taken)", () => {
    cy.intercept("POST", "/auth/register", { statusCode: 409, body: "Conflict" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Benutzername oder E-Mail bereits vergeben.").should("be.visible");
  });

  it("shows generic error on server failure", () => {
    cy.intercept("POST", "/auth/register", { statusCode: 500, body: "Server Error" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Registrierung fehlgeschlagen.").should("be.visible");
  });

  it("disables button while submitting", () => {
    cy.intercept("POST", "/auth/register", (req) => {
      req.reply({ delay: 500, body: { id: 2 } });
    });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Lädt...")
      .and("be.disabled");
  });
});
