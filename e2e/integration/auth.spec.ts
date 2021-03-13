import * as faker from "faker";

describe("auth", () => {
  it("should register successfully", () => {
    const password = faker.internet.password();

    cy.visit("#/auth/register");

    cy.findByLabelText("Username").type(faker.internet.userName());
    cy.findByLabelText("Email").type(faker.internet.email());
    cy.findByLabelText("Password").type(password);
    cy.findByLabelText("Confirm Password").type(password);
    cy.findByText("Submit").click();

    cy.location("hash").should("eql", "#/");
  });

  it("should login successfully", () => {
    cy.createUser().then(({ username, password }) => {
      cy.visit("#/auth/login");
      cy.findByLabelText("Email or Username").type(username);
      cy.findByLabelText("Password").type(password);
      cy.findByText("Submit").click();

      cy.location("hash").should("eql", "#/");
    });
  });
});
