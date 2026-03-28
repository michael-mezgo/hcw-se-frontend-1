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

  it("renders the Benutzer nav link pointing to /admin/users", () => {
    cy.contains("Benutzer")
      .should("be.visible")
      .and("have.attr", "href", "/admin/users");
  });

  it("renders the Zur Website link pointing to /", () => {
    cy.contains("Zur Website")
      .should("be.visible")
      .and("have.attr", "href", "/");
  });

  it("renders the Abmelden button", () => {
    cy.contains("button", "Abmelden").should("be.visible");
  });

  it("renders child route content via Outlet", () => {
    cy.contains("Users Page").should("be.visible");
  });

  it("navigates to /login after clicking Abmelden", () => {
    cy.intercept("POST", "/auth/logout", { statusCode: 200 });
    cy.contains("button", "Abmelden").click();
    cy.contains("Login Page").should("be.visible");
  });
});
