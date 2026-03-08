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
    cy.intercept("GET", "/users/1", { body: mockUser }).as("getUser");
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
    cy.get("h1").should("contain.text", "Mein Profil");
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

  it("switches to edit mode on Bearbeiten click", () => {
    cy.contains("button", "Bearbeiten").click();
    cy.get('button[type="submit"]').should("contain.text", "Speichern");
    cy.contains("button", "Abbrechen").should("exist");
  });

  it("pre-fills edit form with current profile data", () => {
    cy.contains("button", "Bearbeiten").click();
    cy.get('input[type="email"]').should("have.value", "test@example.com");
  });

  it("returns to view mode on Abbrechen click", () => {
    cy.contains("button", "Bearbeiten").click();
    cy.contains("button", "Abbrechen").click();
    cy.contains("button", "Bearbeiten").should("exist");
  });

  it("shows success message after saving profile", () => {
    cy.intercept("PUT", "/users/1", { statusCode: 200, body: { message: "Updated" } });
    cy.intercept("GET", "/users/1", { body: mockUser }).as("refetch");
    cy.contains("button", "Bearbeiten").click();
    cy.get('button[type="submit"]').click();
    cy.wait("@refetch");
    cy.contains("Profil erfolgreich aktualisiert.").should("be.visible");
  });

  it("shows error when save fails", () => {
    cy.intercept("PUT", "/users/1", { statusCode: 500, body: "Error" });
    cy.contains("button", "Bearbeiten").click();
    cy.get('button[type="submit"]').click();
    cy.contains("Aktualisierung fehlgeschlagen.").should("be.visible");
  });
});
