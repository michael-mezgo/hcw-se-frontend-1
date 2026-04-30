import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import Profile from "../../src/pages/Profile";

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

describe("Profile component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userId", "1");
    cy.intercept("GET", "/users/me", { body: mockUser }).as("getUser");
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </MemoryRouter>
    );
    cy.wait("@getUser");
  });

  it("renders heading", () => {
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

  it("switches to edit mode on Edit click", () => {
    cy.contains("button", "Edit").click();
    cy.get('button[type="submit"]').should("contain.text", "Save");
    cy.contains("button", "Cancel").should("exist");
  });

  it("pre-fills edit form with current profile data", () => {
    cy.contains("button", "Edit").click();
    cy.get('input[type="email"]').should("have.value", "test@example.com");
  });

  it("returns to view mode on Cancel click", () => {
    cy.contains("button", "Edit").click();
    cy.contains("button", "Cancel").click();
    cy.contains("button", "Edit").should("exist");
  });

  it("shows success message after saving profile", () => {
    cy.intercept("PATCH", "/users/me", { statusCode: 200, body: { message: "Updated" } });
    cy.intercept("GET", "/users/me", { body: mockUser }).as("refetch");
    cy.contains("button", "Edit").click();
    cy.get('button[type="submit"]').click();
    cy.wait("@refetch");
    cy.contains("Profile updated successfully.").should("be.visible");
  });

  it("shows error when save fails", () => {
    cy.intercept("PATCH", "/users/me", { statusCode: 500, body: "Error" });
    cy.contains("button", "Edit").click();
    cy.get('button[type="submit"]').click();
    cy.contains("Update failed.").should("be.visible");
  });
});
