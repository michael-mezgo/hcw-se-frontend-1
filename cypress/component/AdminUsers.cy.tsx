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
    cy.intercept("GET", "/api/users", { body: mockUsers }).as("getUsers");
    cy.mount(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );
    cy.wait("@getUsers");
  });

  it("renders heading", () => {
    cy.get("h1").should("contain.text", "User management");
  });

  it("shows total user count", () => {
    cy.contains("3 Users in total").should("exist");
  });

  it("renders link to create new user", () => {
    cy.get("a")
      .contains("+ Add User")
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

  it("shows Locked badge for locked users", () => {
    cy.contains("tr", "user2").contains("Locked").should("exist");
  });

  it("shows Active badge for active users", () => {
    cy.contains("tr", "user1").contains("Active").should("exist");
  });

  it("shows Lock button for active users", () => {
    cy.contains("tr", "user1").contains("button", "Lock").should("exist");
  });

  it("shows Unlock button for locked users", () => {
    cy.contains("tr", "user2").contains("button", "Unlock").should("exist");
  });

  it("toggles user lock status on Lock click", () => {
    cy.intercept("PATCH", "/api/users/2", { body: { message: "Updated" } });
    cy.contains("tr", "user1").contains("button", "Lock").click();
    cy.contains("tr", "user1").contains("Locked").should("exist");
  });

  it("toggles user to active on Unlock click", () => {
    cy.intercept("PATCH", "/api/users/3", { body: { message: "Updated" } });
    cy.contains("tr", "user2").contains("button", "Unlock").click();
    cy.contains("tr", "user2").contains("Active").should("exist");
  });

  it("removes user from list after deletion", () => {
    cy.intercept("DELETE", "/api/users/2", { statusCode: 204 });
    cy.on("window:confirm", () => true);
    cy.contains("tr", "user1").contains("button", "Delete").click();
    cy.contains("user1").should("not.exist");
  });

  it("shows error when loading users fails", () => {
    cy.intercept("GET", "/api/users", { statusCode: 500, body: "Error" });
    cy.mount(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );
    cy.contains("Users could not be loaded.").should("be.visible");
  });

  it("shows empty state when no users exist", () => {
    cy.intercept("GET", "/api/users", { body: [] });
    cy.mount(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );
    cy.contains("No Users found.").should("exist");
  });
});
