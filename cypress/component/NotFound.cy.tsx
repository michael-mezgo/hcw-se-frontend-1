import { MemoryRouter } from "react-router-dom";
import NotFound from "../../src/pages/NotFound";

describe("NotFound component", () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
  });

  it("renders 404 heading", () => {
    cy.get("h1").should("contain.text", "404");
  });

  it("renders page not found message", () => {
    cy.contains("Page not found.").should("exist");
  });

  it("renders link back to home", () => {
    cy.get("a")
      .should("contain.text", "Back to Home")
      .and("have.attr", "href", "/");
  });
});
