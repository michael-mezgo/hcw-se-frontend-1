import { MemoryRouter } from "react-router-dom";
import Cars from "../../src/pages/Cars";

describe("Cars component", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Cars />
      </MemoryRouter>
    );
  });

  it("renders the heading", () => {
    cy.get("h1").should("contain.text", "Fahrzeuge");
  });

  it("renders exactly 3 cars", () => {
    cy.get("li").should("have.length", 3);
  });

  it("renders VW Golf with price", () => {
    cy.contains("li", "VW Golf").should("contain.text", "49");
  });

  it("renders BMW 3er with price", () => {
    cy.contains("li", "BMW 3er").should("contain.text", "89");
  });

  it("renders Mercedes C-Klasse with price", () => {
    cy.contains("li", "Mercedes C-Klasse").should("contain.text", "99");
  });

  it("renders link back to home with correct href", () => {
    cy.get("a")
      .should("contain.text", "Zurück zur Startseite")
      .and("have.attr", "href", "/");
  });
});
