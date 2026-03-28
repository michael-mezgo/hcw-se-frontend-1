import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import AdminRoute from "../../src/components/AdminRoute";

function mountAdminRoute(initialPath: string) {
  cy.mount(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin Content</div>
              </AdminRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AdminRoute component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when user is an admin", () => {
    localStorage.setItem("userId", "1");
    localStorage.setItem("isAdmin", "true");
    mountAdminRoute("/admin");
    cy.contains("Admin Content").should("be.visible");
  });

  it("redirects to /login when user is not logged in", () => {
    mountAdminRoute("/admin");
    cy.contains("Login Page").should("be.visible");
    cy.contains("Admin Content").should("not.exist");
  });

  it("redirects to / when user is logged in but not admin", () => {
    localStorage.setItem("userId", "42");
    localStorage.setItem("isAdmin", "false");
    mountAdminRoute("/admin");
    cy.contains("Home Page").should("be.visible");
    cy.contains("Admin Content").should("not.exist");
  });
});
