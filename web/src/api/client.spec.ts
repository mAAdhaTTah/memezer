import { renderHook } from "@testing-library/react-hooks/dom";
import useLocalStorage from "react-use-localstorage";
import { setupServerInTests, chance } from "../testing";
import { ClientProvider, useClient } from "./client";

describe("client", () => {
  setupServerInTests();

  let setToken: jest.Mock;
  let token: string;

  beforeEach(() => {
    setToken = jest.fn();
    token = chance.hash();
    (useLocalStorage as jest.Mock).mockReturnValue([token, setToken]);
  });

  it("should throw if not in client context", async () => {
    global.console.restore?.();
    const { result } = renderHook(() => useClient());
    expect(result.error).toBeInstanceOf(Error);
  });

  describe("isAuthenticated", () => {
    it("should not be authenticated if token missing", () => {
      (useLocalStorage as jest.Mock).mockReturnValue(["", setToken]);
      const { result } = renderHook(() => useClient(), {
        wrapper: ClientProvider,
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should not be authenticated if token present", () => {
      const { result } = renderHook(() => useClient(), {
        wrapper: ClientProvider,
      });

      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("login", () => {
    it.todo("should return success on login");
    it.todo("should return failure on login with creds");
    it.todo("should return failure on login with invalid response body");
  });

  describe("register", () => {
    it.todo("should return success on register with username and password");
    it.todo("should return failure on register with username taken");
    it.todo("should return failure on register with email taken");
    it.todo(
      "should return failure on register when response structure is invalid"
    );
  });

  describe("logout", () => {
    it.todo("should clear token on logout");
  });

  describe("api", () => {
    it.todo("should send token in header");
    it.todo("should logout on 401");
  });
});
