import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useHistory } from "react-router-dom";
import { chance, Kit, setupServerInTests } from "../testing";
import { useAuth } from "./token";
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
    submitBtnToBeEnabled: () =>
      waitFor(() => expect(elems.submitBtn()).toBeEnabled()),
    submitBtnToBeDisabled: () =>
      waitFor(() => expect(elems.submitBtn()).toBeDisabled()),
  }));

jest.mock("./token", () => {
  const module = jest.requireActual("./token") as any;
  return {
    ...module,
    useAuth: jest.fn(module.useAuth),
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
    mockAuthApi = {
      token: "",
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    };
    (useAuth as jest.Mock).mockReturnValue(mockAuthApi);

    mockHistory = {
      push: jest.fn(),
    };
    (useHistory as jest.Mock).mockReturnValue(mockHistory);
  });

  it("should be disabled if password is empty", async () => {
    const run = kit.run();

    run.fire.typeUsername(chance.email());

    await run.waitFor.submitBtnToBeDisabled();
  });

  it("should be disabled if username is empty", async () => {
    const run = kit.run();

    run.fire.typePassword(chance.hash({ length: 15 }));

    await run.waitFor.submitBtnToBeDisabled();
  });

  it("should enabled & submit successfully if username & password is filled", async () => {
    const run = kit.run();

    const username = chance.email();
    const password = chance.hash({ length: 15 });

    run.fire.typeUsername(username);
    run.fire.typePassword(password);

    await run.waitFor.submitBtnToBeEnabled();

    run.fire.clickSubmit();

    await waitFor(() => expect(mockAuthApi.login).toHaveBeenCalledTimes(1));
    expect(mockAuthApi.login).toHaveBeenCalledWith(username, password);

    const history = useHistory();
    await waitFor(() => expect(history.push).toHaveBeenCalledTimes(1));
    expect(history.push).toHaveBeenCalledWith(HOME);
  });
});
