import App from "../../src/App";

describe("App component", () => {
  it("mounts without errors", () => {
    cy.mount(<App />);
  });

  it("renders the Browse Cars heading", () => {
    cy.get(".browse-cars-header h2").should("contain.text", "Browse Cars");
  });

  it("renders the car list container", () => {
    cy.get(".car-list").should("exist");
  });

  it("renders 10 car entries", () => {
    cy.get(".car-details").should("have.length", 10);
  });

  it("renders car titles with correct numbering", () => {
    cy.get(".car-details").first().find("h3").should("contain.text", "Car 1");
    cy.get(".car-details").last().find("h3").should("contain.text", "Car 10");
  });

  it("renders car details text including brand, model, year, and price", () => {
    cy.get(".car-details").first().within(() => {
      cy.get(".car-details-text p").eq(0).should("contain.text", "Brand:");
      cy.get(".car-details-text p").eq(1).should("contain.text", "Model:");
      cy.get(".car-details-text p").eq(2).should("contain.text", "Year of manufacture:");
      cy.get(".car-details-text p").eq(3).should("contain.text", "Price:");
    });
  });

  it("renders a placeholder image for each car", () => {
    cy.get(".car-details img[alt='Placeholder car image']").should(
      "have.length",
      10
    );
  });

  it("renders car image containers", () => {
    cy.get(".car-image").should("have.length", 10);
  });
});
