// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";
import * as faker from "faker";

Cypress.Commands.add(
  "createUser",
  ({
    username = faker.internet.userName(),
    email = faker.internet.email(),
    password = faker.internet.password(),
  } = {}) =>
    cy
      .request({
        url: "/api/auth/register",
        method: "POST",
        body: {
          username,
          email,
          password,
          confirm_password: password,
        },
      })
      .then((resp) => ({
        username,
        email,
        password,
        token: resp.body.access_token,
      }))
);

type User = {
  username: string;
  email: string;
  password: string;
};

type CreatedUser = User & {
  token: string;
};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      createUser(user?: Partial<User>): Chainable<CreatedUser>;
    }
  }
}
