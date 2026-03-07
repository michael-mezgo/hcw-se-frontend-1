import App from "../../src/App";

describe("App component", () => {
  it("mounts without errors", () => {
    cy.mount(<App />);
  });
});
