import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useHistory } from "react-router-dom";
import { chance, Kit, setupServerInTests } from "../testing";
import { useClient } from "../api";
import { Register } from "./Register";
import { HOME } from "../home";

const kit = Kit.create(Register, () => ({}))
  .setElements((rr) => ({
    username: () => rr.getByLabelText("Username"),
    email: () => rr.getByLabelText("Email"),
    password: () => rr.getByLabelText("Password"),
    confirm: () => rr.getByLabelText("Confirm Password"),
    submitBtn: () => rr.getByText("Submit").closest("button")!,
  }))
  .setFire((elems) => ({
    typeUsername: (username: string) =>
      userEvent.type(elems.username(), username),
    typeEmail: (email: string) => userEvent.type(elems.email(), email),
    typePassword: (password: string) =>
      userEvent.type(elems.password(), password),
    typeConfirm: (confirm: string) => userEvent.type(elems.confirm(), confirm),
    fillForm({
      username,
      email,
      password,
      confirm,
    }: {
      username?: string;
      email?: string;
      password?: string;
      confirm?: string;
    }) {
      username != null && this.typeUsername(username);
      email != null && this.typeEmail(email);
      password != null && this.typePassword(password);
      confirm != null && this.typeConfirm(confirm);
    },
    clickSubmit: () => userEvent.click(elems.submitBtn()),
  }))
  .setAsync((elems) => ({
    usernameToBeError: () =>
      waitFor(() => expect(elems.username()).toBeInvalid()),
    emailToBeError: () => waitFor(() => expect(elems.email()).toBeInvalid()),
    passwordToBeError: () =>
      waitFor(() => expect(elems.password()).toBeInvalid()),
    confirmToBeError: () =>
      waitFor(() => expect(elems.confirm()).toBeInvalid()),
  }));

jest.mock("../api", () => {
  const module = jest.requireActual("../api") as any;
  return {
    ...module,
    useClient: jest.fn(module.useClient),
  };
});

jest.mock("react-router-dom", () => {
  const module = jest.requireActual("react-router-dom") as any;
  return {
    ...module,
    useHistory: jest.fn(),
  };
});

describe("Login", () => {
  setupServerInTests();

  let mockAuthApi: any;
  let mockHistory: any;

  beforeEach(() => {
    (useClient as jest.Mock).mockReturnValue(
      (mockAuthApi = {
        isAuthenticated: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
      })
    );

    (useHistory as jest.Mock).mockReturnValue(
      (mockHistory = {
        push: jest.fn(),
      })
    );
  });

  it("should be in error if username is empty", async () => {
    const run = kit.run();

    const password = chance.hash({ limit: 15 });
    run.fire.fillForm({
      email: chance.email(),
      password,
      confirm: password,
    });
    run.fire.clickSubmit();

    await run.waitFor.usernameToBeError();
  });

  it("should should be in error if email is empty", async () => {
    const run = kit.run();

    const password = chance.hash({ limit: 15 });
    run.fire.fillForm({
      username: chance.first(),
      password,
      confirm: password,
    });
    run.fire.clickSubmit();

    await run.waitFor.emailToBeError();
  });

  it("should should be in error if email is invalid", async () => {
    const run = kit.run();

    const password = chance.hash({ limit: 15 });
    run.fire.fillForm({
      username: chance.first(),
      email: "name@",
      password,
      confirm: password,
    });
    run.fire.clickSubmit();

    await run.waitFor.emailToBeError();
  });

  it("should show error if password is empty", async () => {
    const run = kit.run();

    run.fire.fillForm({
      username: chance.first(),
      email: chance.email(),
      confirm: chance.hash({ limit: 15 }),
    });
    run.fire.clickSubmit();

    await run.waitFor.passwordToBeError();
  });

  it("should should error if confirm is empty", async () => {
    const run = kit.run();

    run.fire.fillForm({
      username: chance.first(),
      email: chance.email(),
      password: chance.hash({ limit: 15 }),
    });
    run.fire.clickSubmit();

    await run.waitFor.confirmToBeError();
  });

  it("should should error if confirm doesn't match password", async () => {
    const run = kit.run();

    run.fire.fillForm({
      username: chance.first(),
      email: chance.email(),
      password: chance.hash({ limit: 15 }),
      confirm: chance.hash({ limit: 15 }),
    });
    run.fire.clickSubmit();

    await run.waitFor.confirmToBeError();
  });

  it("should submit successfully if form is filled correctly", async () => {
    const run = kit.run();

    const username = chance.first();
    const email = chance.email();
    const password = chance.hash({ length: 15 });

    run.fire.fillForm({
      username,
      email,
      password,
      confirm: password,
    });
    run.fire.clickSubmit();

    await waitFor(() => expect(mockAuthApi.register).toHaveBeenCalledTimes(1));
    expect(mockAuthApi.register).toHaveBeenCalledWith(
      username,
      email,
      password,
      password
    );

    await waitFor(() => expect(mockHistory.push).toHaveBeenCalledTimes(1));
    expect(mockHistory.push).toHaveBeenCalledWith(HOME);
  });
});
