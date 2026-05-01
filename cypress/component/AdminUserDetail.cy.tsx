import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminUserDetail from "../../src/pages/admin/AdminUserDetail";

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

function mountWithRoute() {
  cy.mount(
    <MemoryRouter initialEntries={["/admin/users/1"]}>
      <Routes>
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminUserDetail component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/users/1", { body: mockUser }).as("getUser");
    mountWithRoute();
    cy.wait("@getUser");
  });

  it("renders username as heading", () => {
    cy.get("h1").should("contain.text", "testuser");
  });

  it("renders user ID", () => {
    cy.contains("User #1").should("exist");
  });

  it("renders link back to users list", () => {
    cy.get("a[href='/admin/users']").should("exist");
  });

  it("pre-fills form with user data", () => {
    cy.get('input[type="email"]').should("have.value", "test@example.com");
  });

  it("renders save button", () => {
    cy.get('button[type="submit"]').should("contain.text", "Save");
  });

  it("renders delete button", () => {
    cy.contains("button", "Delete User").should("exist");
  });

  it("renders admin toggle", () => {
    cy.contains("Administrator").should("exist");
  });

  it("renders locked toggle", () => {
    cy.contains("Account locked").should("exist");
  });

  it("shows success message after saving", () => {
    cy.intercept("PATCH", "/users/1", { body: { message: "Updated" } });
    cy.get('button[type="submit"]').click();
    cy.contains("User updated successfully.").should("be.visible");
  });

  it("shows error message when save fails", () => {
    cy.intercept("PATCH", "/users/1", { statusCode: 500, body: "Error" });
    cy.get('button[type="submit"]').click();
    cy.contains("Update failed.").should("be.visible");
  });

  it("clears password field after successful save", () => {
    cy.intercept("PATCH", "/users/1", { body: { message: "Updated" } });
    cy.get('input[type="password"]').type("newpassword");
    cy.get('button[type="submit"]').click();
    cy.get('input[type="password"]').should("have.value", "");
  });

  it("shows error when user not found", () => {
    cy.intercept("GET", "/users/99", { statusCode: 404, body: "Not Found" });
    cy.mount(
      <MemoryRouter initialEntries={["/admin/users/99"]}>
        <Routes>
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("User not found.").should("be.visible");
  });
});
