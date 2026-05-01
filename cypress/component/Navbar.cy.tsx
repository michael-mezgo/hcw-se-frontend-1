import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import Navbar from "../../src/components/Navbar";

function mountNavbar() {
  cy.mount(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Navbar component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders brand link to home", () => {
    mountNavbar();
    cy.get("a").filter(':contains("Car Rental")').should("have.attr", "href", "/");
  });

  it("renders cars navigation link", () => {
    mountNavbar();
    cy.get("a[href='/cars']").should("contain.text", "Cars");
  });

  describe("when logged out", () => {
    beforeEach(() => {
      mountNavbar();
    });

    it("shows Log in link", () => {
      cy.get("a[href='/login']").should("contain.text", "Log in");
    });

    it("shows Register link", () => {
      cy.get("a[href='/register']").should("contain.text", "Register");
    });

    it("does not show Profile link", () => {
      cy.get("a[href='/profile']").should("not.exist");
    });

    it("does not show Log out button", () => {
      cy.contains("button", "Log out").should("not.exist");
    });
  });

  describe("when logged in as regular user", () => {
    beforeEach(() => {
      localStorage.setItem("userId", "1");
      localStorage.setItem("isAdmin", "false");
      mountNavbar();
    });

    it("shows Profile link", () => {
      cy.get("a[href='/profile']").should("contain.text", "Profile");
    });

    it("shows Log out button", () => {
      cy.contains("button", "Log out").should("exist");
    });

    it("does not show Admin link", () => {
      cy.get("a[href='/admin']").should("not.exist");
    });

    it("does not show Log in link", () => {
      cy.get("a[href='/login']").should("not.exist");
    });
  });

  describe("when logged in as admin", () => {
    beforeEach(() => {
      localStorage.setItem("userId", "2");
      localStorage.setItem("isAdmin", "true");
      mountNavbar();
    });

    it("shows Admin link", () => {
      cy.get("a[href='/admin']").should("contain.text", "Admin");
    });

    it("shows Profile link", () => {
      cy.get("a[href='/profile']").should("contain.text", "Profile");
    });
  });

  it("logs out and redirects to login on Log out click", () => {
    localStorage.setItem("userId", "1");
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("token", "some-token");
    mountNavbar();
    cy.contains("button", "Log out").click();
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
    });
  });
});
