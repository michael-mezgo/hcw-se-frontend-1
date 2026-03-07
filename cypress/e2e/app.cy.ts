describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the heading", () => {
    cy.get("h1").should("contain.text", "Car Rental");
  });

  it("displays the welcome text", () => {
    cy.contains("Willkommen bei unserem Autovermietungs-Service.").should("be.visible");
  });

  it("has a link to the cars page", () => {
    cy.get("a").contains("Alle Fahrzeuge ansehen").should("exist");
  });

  it("navigates to cars page on link click", () => {
    cy.get("a").contains("Alle Fahrzeuge ansehen").click();
    cy.url().should("include", "/cars");
    cy.get("h1").should("contain.text", "Fahrzeuge");
  });
});

describe("Cars page", () => {
  beforeEach(() => {
    cy.visit("/cars");
  });

  it("displays the heading", () => {
    cy.get("h1").should("contain.text", "Fahrzeuge");
  });

  it("displays all 3 cars", () => {
    cy.get("li").should("have.length", 3);
  });

  it("displays VW Golf", () => {
    cy.contains("li", "VW Golf").should("contain.text", "49");
  });

  it("displays BMW 3er", () => {
    cy.contains("li", "BMW 3er").should("contain.text", "89");
  });

  it("displays Mercedes C-Klasse", () => {
    cy.contains("li", "Mercedes C-Klasse").should("contain.text", "99");
  });

  it("navigates back to home on link click", () => {
    cy.get("a").contains("Zurück zur Startseite").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.get("h1").should("contain.text", "Car Rental");
  });
});
