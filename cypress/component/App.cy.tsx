import App from "../../src/App";

describe("App component", () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  it("renders the Browse Cars heading", () => {
    cy.get(".browse-cars-header h2").should("contain.text", "Browse Cars");
  });

  it("renders 10 car entries", () => {
    cy.get(".car-details").should("have.length", 10);
  });

  it("renders car titles with correct numbering", () => {
    cy.get(".car-details h3").first().should("contain.text", "Car 1");
    cy.get(".car-details h3").last().should("contain.text", "Car 10");
  });

  it("renders car detail fields for each car", () => {
    cy.get(".car-details").first().within(() => {
      cy.get("p").contains("Brand:");
      cy.get("p").contains("Model:");
      cy.get("p").contains("Year of manufacture:");
      cy.get("p").contains("Price:");
    });
  });

  it("renders a placeholder image for each car", () => {
    cy.get(".car-details img[alt='Placeholder car image']").should("have.length", 10);
  });

  it("renders car images with the correct width", () => {
    cy.get(".car-details img[alt='Placeholder car image']").each(($img) => {
      cy.wrap($img).should("have.attr", "width", "300");
    });
  });
});
