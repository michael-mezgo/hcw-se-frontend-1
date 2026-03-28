import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import ProtectedRoute from "../../src/components/ProtectedRoute";

function mountProtectedRoute(initialPath: string) {
  cy.mount(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("ProtectedRoute component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when user is logged in", () => {
    localStorage.setItem("userId", "42");
    mountProtectedRoute("/protected");
    cy.contains("Protected Content").should("be.visible");
  });

  it("redirects to /login when user is not logged in", () => {
    mountProtectedRoute("/protected");
    cy.contains("Login Page").should("be.visible");
    cy.contains("Protected Content").should("not.exist");
  });
});
