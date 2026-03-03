describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the main heading", () => {
    cy.get("h1").should("contain.text", "Vite + React");
  });

  it("displays the Vite logo link", () => {
    cy.get('a[href="https://vite.dev"]')
      .should("exist")
      .find("img[alt='Vite logo']")
      .should("be.visible");
  });

  it("displays the React logo link", () => {
    cy.get('a[href="https://react.dev"]')
      .should("exist")
      .find("img[alt='React logo']")
      .should("be.visible");
  });

  it("starts the counter at 0", () => {
    cy.get("button").should("contain.text", "count is 0");
  });

  it("increments the counter on click", () => {
    cy.get("button").click();
    cy.get("button").should("contain.text", "count is 1");

    cy.get("button").click();
    cy.get("button").should("contain.text", "count is 2");
  });

  it("displays the hint text", () => {
    cy.get(".read-the-docs").should(
      "contain.text",
      "Click on the Vite and React logos to learn more"
    );
  });
});
