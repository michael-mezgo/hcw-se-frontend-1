import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import Login from "../../src/pages/Login";

describe("Login component", () => {
  beforeEach(() => {
    localStorage.clear();
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Anmelden");
  });

  it("renders username and password inputs", () => {
    cy.get('input[type="text"]').should("exist");
    cy.get('input[type="password"]').should("exist");
  });

  it("renders submit button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Anmelden");
  });

  it("renders link to register page", () => {
    cy.get("a")
      .should("contain.text", "Registrieren")
      .and("have.attr", "href", "/register");
  });

  it("shows error on failed login", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 401,
      body: "Unauthorized",
    });
    cy.get('input[type="text"]').type("wronguser");
    cy.get('input[type="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.contains("Ungültige Anmeldedaten.").should("be.visible");
  });

  it("disables button and shows loading text while submitting", () => {
    cy.intercept("POST", "/auth/login", (req) => {
      req.reply({ delay: 500, body: { userId: 1, isAdmin: false } });
    });
    cy.get('input[type="text"]').type("user");
    cy.get('input[type="password"]').type("pass");
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should("contain.text", "Lädt...")
      .and("be.disabled");
  });
});
