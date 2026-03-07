describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the Browse Cars heading", () => {
    cy.get(".browse-cars-header h2").should("contain.text", "Browse Cars");
  });

  it("displays 10 car entries", () => {
    cy.get(".car-details").should("have.length", 10);
  });

  it("displays car titles with correct numbering", () => {
    cy.get(".car-details h3").first().should("contain.text", "Car 1");
    cy.get(".car-details h3").last().should("contain.text", "Car 10");
  });

  it("displays car detail fields for the first car", () => {
    cy.get(".car-details").first().within(() => {
      cy.get("p").contains("Brand:");
      cy.get("p").contains("Model:");
      cy.get("p").contains("Year of manufacture:");
      cy.get("p").contains("Price:");
    });
  });

  it("displays a placeholder image for each car", () => {
    cy.get(".car-details img[alt='Placeholder car image']").should("have.length", 10);
  });
});
