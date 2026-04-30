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
    cy.get("h1").should("contain.text", "Register");
  });

  it("renders all required fields", () => {
    cy.contains("label", "User name").should("exist");
    cy.contains("label", "E-mail").should("exist");
    cy.contains("label", "Password").should("exist");
    cy.contains("label", "First name").should("exist");
    cy.contains("label", "Last name").should("exist");
    cy.contains("label", "License number").should("exist");
    cy.contains("label", "License valid until").should("exist");
  });

  it("renders submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Create account");
  });

  it("renders link to login page", () => {
    cy.get("a")
      .should("contain.text", "Log in")
      .and("have.attr", "href", "/login");
  });

  it("shows error on conflict (username or email already taken)", () => {
    cy.intercept("POST", "/auth/register", { statusCode: 409, body: "Conflict" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("User name or E-mail address already taken.").should("be.visible");
  });

  it("shows generic error on server failure", () => {
    cy.intercept("POST", "/auth/register", { statusCode: 500, body: "Server Error" });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.contains("Registration failed.").should("be.visible");
  });

  it("disables button while submitting", () => {
    cy.intercept("POST", "/auth/register", (req) => {
      req.reply({ delay: 500, body: { id: 2 } });
    });
    fillForm();
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Loading...")
      .and("be.disabled");
  });
});
