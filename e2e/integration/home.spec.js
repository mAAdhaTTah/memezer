describe("Homepage", () => {
  before(() => {
    cy.visit("/");
  });

  it("should show homepage", () => {
    cy.contains("Memezer").should("exist");
  });
});
