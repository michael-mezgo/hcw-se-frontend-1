import { MemoryRouter } from "react-router-dom";
import Home from "../../src/pages/Home";

describe("Home component", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  it("renders the heading", () => {
    cy.get("h1").should("contain.text", "Car Rental");
  });

  it("renders the welcome text", () => {
    cy.contains("Willkommen bei unserem Autovermietungs-Service.").should("exist");
  });

  it("renders link to cars page with correct href", () => {
    cy.get("a")
      .should("contain.text", "Alle Fahrzeuge ansehen")
      .and("have.attr", "href", "/cars");
  });
});
