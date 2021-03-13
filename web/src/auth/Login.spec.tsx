import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useHistory } from "react-router-dom";
import { chance, Kit, setupServerInTests } from "../testing";
import { useClient } from "../api";
import { Login } from "./Login";
import { HOME } from "../home";

const kit = Kit.create(Login, () => ({}))
  .setElements((rr) => ({
    username: () => rr.getByLabelText("Email or Username"),
    password: () => rr.getByLabelText("Password"),
    submitBtn: () => rr.getByText("Submit").closest("button")!,
  }))
  .setFire((elems) => ({
    typeUsername: (username: string) =>
      userEvent.type(elems.username(), username),
    typePassword: (password: string) =>
      userEvent.type(elems.password(), password),
    clickSubmit: () => userEvent.click(elems.submitBtn()),
  }))
  .setAsync((elems) => ({
    usernameToBeError: () =>
      waitFor(() => expect(elems.username()).toBeInvalid()),
    passwordToBeError: () =>
      waitFor(() => expect(elems.password()).toBeInvalid()),
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

  it("should error if username is empty", async () => {
    const run = kit.run();

    run.fire.typePassword(chance.hash({ length: 15 }));
    run.fire.clickSubmit();

    await run.waitFor.usernameToBeError();
  });

  it("should show error if password is empty", async () => {
    const run = kit.run();

    run.fire.typeUsername(chance.email());
    run.fire.clickSubmit();

    await run.waitFor.passwordToBeError();
  });

  it("should submit successfully if username & password is filled", async () => {
    const run = kit.run();

    const username = chance.email();
    const password = chance.hash({ length: 15 });

    run.fire.typeUsername(username);
    run.fire.typePassword(password);
    run.fire.clickSubmit();

    await waitFor(() => expect(mockAuthApi.login).toHaveBeenCalledTimes(1));
    expect(mockAuthApi.login).toHaveBeenCalledWith(username, password);

    await waitFor(() => expect(mockHistory.push).toHaveBeenCalledTimes(1));
    expect(mockHistory.push).toHaveBeenCalledWith(HOME);
  });
});
