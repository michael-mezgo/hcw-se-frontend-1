describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the Browse Cars heading", () => {
    cy.get(".browse-cars-header h2").should("contain.text", "Browse Cars");
  });

  it("displays the car list", () => {
    cy.get(".car-list").should("exist");
  });

  it("displays 10 car entries", () => {
    cy.get(".car-details").should("have.length", 10);
  });

  it("displays car titles with correct numbering", () => {
    cy.get(".car-details").first().find("h3").should("contain.text", "Car 1");
    cy.get(".car-details").last().find("h3").should("contain.text", "Car 10");
  });

  it("displays car details text for each car", () => {
    cy.get(".car-details").first().within(() => {
      cy.get(".car-details-text").should("exist");
      cy.get("p").should("have.length.gte", 4);
    });
  });

  it("displays a placeholder image for each car", () => {
    cy.get(".car-details img[alt='Placeholder car image']").should(
      "have.length",
      10
    );
  });
});
