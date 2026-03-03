import App from "../../src/App";

describe("App component", () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  it("renders the main heading", () => {
    cy.get("h1").should("contain.text", "Vite + React");
  });

  it("renders the Vite logo with correct alt text", () => {
    cy.get("img[alt='Vite logo']").should("exist");
  });

  it("renders the React logo with correct alt text", () => {
    cy.get("img[alt='React logo']").should("exist");
  });

  it("renders the counter button starting at 0", () => {
    cy.get("button").should("contain.text", "count is 0");
  });

  it("increments the counter on each click", () => {
    cy.get("button").click();
    cy.get("button").should("contain.text", "count is 1");

    cy.get("button").click();
    cy.get("button").should("contain.text", "count is 2");
  });

  it("renders the hint text", () => {
    cy.get(".read-the-docs").should(
      "contain.text",
      "Click on the Vite and React logos to learn more"
    );
  });

  it("renders the edit hint inside the card", () => {
    cy.get(".card p code").should("contain.text", "src/App.tsx");
  });
});
