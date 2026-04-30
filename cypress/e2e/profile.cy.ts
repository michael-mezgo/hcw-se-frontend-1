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

  it("shows Edit and Delete account buttons", () => {
    cy.contains("button", "Edit").should("exist");
    cy.contains("button", "Delete account").should("exist");
  });

  it("enters edit mode on Edit click", () => {
    cy.contains("button", "Edit").click();
    cy.get('button[type="submit"]').should("contain.text", "Save");
    cy.contains("button", "Cancel").should("exist");
  });

  it("pre-fills edit form with current data", () => {
    cy.contains("button", "Edit").click();
    cy.get('input[type="email"]').should("have.value", "test@example.com");
  });

  it("returns to view mode on Cancel", () => {
    cy.contains("button", "Edit").click();
    cy.contains("button", "Cancel").click();
    cy.contains("button", "Edit").should("exist");
  });

  it("shows success message after saving profile", () => {
    cy.intercept("PATCH", "/users/me", { body: mockUser });
    cy.intercept("GET", "/users/me", { body: mockUser }).as("refetch");
    cy.intercept("GET", "/users/me/cars*", { body: [] });
    cy.contains("button", "Edit").click();
    cy.get('button[type="submit"]').click();
    cy.wait("@refetch");
    cy.contains("Profile updated successfully.").should("be.visible");
  });

  it("shows error when saving fails", () => {
    cy.intercept("PUT", "/users/me", { statusCode: 500, body: "Error" });
    cy.contains("button", "Edit").click();
    cy.get('button[type="submit"]').click();
    cy.contains("Update failed.").should("be.visible");
  });

  it("redirects to login after account deletion", () => {
    cy.intercept("DELETE", "/users/me", { statusCode: 204 });
    cy.on("window:confirm", () => true);
    cy.contains("button", "Delete account").click();
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
