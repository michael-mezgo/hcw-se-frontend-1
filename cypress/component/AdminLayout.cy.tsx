import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import AdminLayout from "../../src/pages/admin/AdminLayout";

function mountAdminLayout() {
  cy.mount(
    <MemoryRouter initialEntries={["/admin/users"]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<div>Users Page</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AdminLayout component", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "1");
    localStorage.setItem("isAdmin", "true");
    mountAdminLayout();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders the sidebar branding", () => {
    cy.contains("Admin Panel").should("be.visible");
    cy.contains("Car Rental").should("be.visible");
  });

  it("renders the User nav link pointing to /admin/users", () => {
    cy.contains("User")
      .should("be.visible")
      .and("have.attr", "href", "/admin/users");
  });

  it("renders the To the Rental Page link pointing to /", () => {
    cy.contains("To the Rental Page")
      .should("be.visible")
      .and("have.attr", "href", "/");
  });

  it("renders the Log out button", () => {
    cy.contains("button", "Log out").should("be.visible");
  });

  it("renders child route content via Outlet", () => {
    cy.contains("Users Page").should("be.visible");
  });

  it("navigates to /login after clicking Log out", () => {
    cy.intercept("POST", "/auth/logout", { statusCode: 200 });
    cy.contains("button", "Log out").click();
    cy.contains("Login Page").should("be.visible");
  });
});
