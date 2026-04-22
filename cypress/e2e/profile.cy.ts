//TODO: use "real" backend for testing

const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  licenseNumber: "L123456",
  licenseValidUntil: "2030-01-01",
  isAdmin: false,
  isLocked: false,
};

describe("Profile page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/users/me", { body: mockUser }).as("getUser");
    cy.visit("/profile", {
      onBeforeLoad(win) {
        win.localStorage.setItem("userId", "1");
        win.localStorage.setItem("isAdmin", "false");
      },
    });
    cy.wait("@getUser");
  });

  it("displays profile heading", () => {
    cy.get("h1").should("contain.text", "My Profile");
  });

  it("displays username", () => {
    cy.contains("testuser").should("be.visible");
  });

  it("displays email", () => {
    cy.contains("test@example.com").should("be.visible");
  });

  it("displays first and last name", () => {
    cy.contains("John").should("be.visible");
    cy.contains("Doe").should("be.visible");
  });

  it("displays license number", () => {
    cy.contains("L123456").should("be.visible");
  });

  it("shows Bearbeiten and Konto löschen buttons", () => {
    cy.contains("button", "Bearbeiten").should("exist");
    cy.contains("button", "Konto löschen").should("exist");
  });

  it("enters edit mode on Bearbeiten click", () => {
    cy.contains("button", "Bearbeiten").click();
    cy.get('button[type="submit"]').should("contain.text", "Speichern");
    cy.contains("button", "Abbrechen").should("exist");
  });

  it("pre-fills edit form with current data", () => {
    cy.contains("button", "Bearbeiten").click();
    cy.get('input[type="email"]').should("have.value", "test@example.com");
  });

  it("returns to view mode on Abbrechen", () => {
    cy.contains("button", "Bearbeiten").click();
    cy.contains("button", "Abbrechen").click();
    cy.contains("button", "Bearbeiten").should("exist");
  });

  it("shows success message after saving profile", () => {
    cy.intercept("PATCH", "/users/me", { body: { message: "Updated" } });
    cy.intercept("GET", "/users/me", { body: mockUser }).as("refetch");
    cy.contains("button", "Bearbeiten").click();
    cy.get('button[type="submit"]').click();
    cy.wait("@refetch");
    cy.contains("Profil erfolgreich aktualisiert.").should("be.visible");
  });

  it("shows error when saving fails", () => {
    cy.intercept("PUT", "/users/me", { statusCode: 500, body: "Error" });
    cy.contains("button", "Bearbeiten").click();
    cy.get('button[type="submit"]').click();
    cy.contains("Aktualisierung fehlgeschlagen.").should("be.visible");
  });

  it("redirects to login after account deletion", () => {
    cy.intercept("DELETE", "/users/me", { statusCode: 204 });
    cy.on("window:confirm", () => true);
    cy.contains("button", "Konto löschen").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/login");
  });
});

describe("Profile – unauthenticated redirect", () => {
  it("redirects to /login if not logged in", () => {
    cy.clearAllLocalStorage();
    cy.intercept("GET", "/users/*", { statusCode: 401, body: "Unauthorized" });
    cy.visit("/profile", {
      onBeforeLoad(win) {
        win.localStorage.setItem("userId", "1");
      },
    });
    cy.url().should("include", "/login");
  });
});
