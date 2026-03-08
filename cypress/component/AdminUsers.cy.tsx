import { MemoryRouter } from "react-router-dom";
import AdminUsers from "../../src/pages/admin/AdminUsers";

const mockUsers = [
  {
    id: 1,
    username: "adminuser",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    licenseNumber: "A1",
    licenseValidUntil: "2030-01-01",
    isAdmin: true,
    isLocked: false,
  },
  {
    id: 2,
    username: "user1",
    email: "user1@example.com",
    firstName: "John",
    lastName: "Doe",
    licenseNumber: "L1",
    licenseValidUntil: "2030-01-01",
    isAdmin: false,
    isLocked: false,
  },
  {
    id: 3,
    username: "user2",
    email: "user2@example.com",
    firstName: "Jane",
    lastName: "Smith",
    licenseNumber: "L2",
    licenseValidUntil: "2030-01-01",
    isAdmin: false,
    isLocked: true,
  },
];

describe("AdminUsers component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/admin/users", { body: mockUsers }).as("getUsers");
    cy.mount(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );
    cy.wait("@getUsers");
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "Benutzerverwaltung");
  });

  it("shows total user count", () => {
    cy.contains("3 Benutzer gesamt").should("exist");
  });

  it("renders link to create new user", () => {
    cy.get("a")
      .contains("+ Benutzer erstellen")
      .should("have.attr", "href", "/admin/users/new");
  });

  it("renders all users in table", () => {
    cy.contains("adminuser").should("exist");
    cy.contains("user1").should("exist");
    cy.contains("user2").should("exist");
  });

  it("shows Admin badge for admin users", () => {
    cy.contains("tr", "adminuser").contains("Admin").should("exist");
  });

  it("shows Gesperrt badge for locked users", () => {
    cy.contains("tr", "user2").contains("Gesperrt").should("exist");
  });

  it("shows Aktiv badge for active users", () => {
    cy.contains("tr", "user1").contains("Aktiv").should("exist");
  });

  it("shows Sperren button for active users", () => {
    cy.contains("tr", "user1").contains("button", "Sperren").should("exist");
  });

  it("shows Entsperren button for locked users", () => {
    cy.contains("tr", "user2").contains("button", "Entsperren").should("exist");
  });

  it("toggles user lock status on Sperren click", () => {
    cy.intercept("PUT", "/admin/users/2", { body: { message: "Updated" } });
    cy.contains("tr", "user1").contains("button", "Sperren").click();
    cy.contains("tr", "user1").contains("Gesperrt").should("exist");
  });

  it("toggles user to active on Entsperren click", () => {
    cy.intercept("PUT", "/admin/users/3", { body: { message: "Updated" } });
    cy.contains("tr", "user2").contains("button", "Entsperren").click();
    cy.contains("tr", "user2").contains("Aktiv").should("exist");
  });

  it("removes user from list after deletion", () => {
    cy.intercept("DELETE", "/admin/users/2", { statusCode: 204 });
    cy.on("window:confirm", () => true);
    cy.contains("tr", "user1").contains("button", "Löschen").click();
    cy.contains("user1").should("not.exist");
  });

  it("shows error when loading users fails", () => {
    cy.intercept("GET", "/admin/users", { statusCode: 500, body: "Error" });
    cy.mount(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );
    cy.contains("Benutzer konnten nicht geladen werden.").should("be.visible");
  });

  it("shows empty state when no users exist", () => {
    cy.intercept("GET", "/admin/users", { body: [] });
    cy.mount(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );
    cy.contains("Keine Benutzer gefunden.").should("exist");
  });
});
