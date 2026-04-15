import App from "../../src/App";

function navigateTo(path: string) {
  cy.window().then((win) => win.history.pushState({}, "", path));
}

describe("App routing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Home on /", () => {
    navigateTo("/");
    cy.mount(<App />);
    cy.get("h1").should("contain.text", "Car Rental");
  });

  it("renders Login on /login", () => {
    navigateTo("/login");
    cy.mount(<App />);
    cy.get("h1").should("contain.text", "Anmelden");
  });

  it("renders 404 for unknown route", () => {
    navigateTo("/this-does-not-exist");
    cy.mount(<App />);
    cy.get("h1").should("contain.text", "404");
  });

  it("redirects /profile to /login when not authenticated", () => {
    navigateTo("/profile");
    cy.mount(<App />);
    cy.get("h1").should("contain.text", "Anmelden");
  });

  it("redirects /admin to /login when not authenticated", () => {
    navigateTo("/admin");
    cy.mount(<App />);
    cy.get("h1").should("contain.text", "Anmelden");
  });

  it("redirects /admin to / when authenticated but not admin", () => {
    localStorage.setItem("userId", "42");
    localStorage.setItem("isAdmin", "false");
    navigateTo("/admin");
    cy.mount(<App />);
    cy.get("h1").should("contain.text", "Car Rental");
  });
});
