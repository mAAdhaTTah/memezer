import { waitFor } from "@testing-library/react";
import { Response } from "miragejs";
import * as React from "react";
import { useClient } from "../api";
import { render, setupServerInTests } from "../testing";
import { View } from "./View";

jest.mock("../api", () => {
  const module = jest.requireActual("../api");
  return {
    ...module,
    useClient: jest.fn(module.useClient),
  };
});

describe("home#View", () => {
  setupServerInTests();

  beforeEach(() => {
    (useClient as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });
  });

  it("should show the logged out view when not authenticated", () => {
    (useClient as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });
    const { getByTestId } = render(<View />);

    expect(getByTestId("home-loggedout")).toBeInTheDocument();
  });

  it("should render the empty view with no memes", async () => {
    const { getByTestId } = render(<View />);

    await waitFor(() => expect(getByTestId("home-empty")).toBeInTheDocument());
  });

  it("should render the success view with loaded memes", async () => {
    server.createList("meme", 10);
    const { getByTestId } = render(<View />);

    await waitFor(() =>
      expect(getByTestId("home-success")).toBeInTheDocument()
    );
  });

  it("should render the error view when backend returns error", async () => {
    server.get(
      "/memes",
      () => new Response(500, {}, { message: "Server is down" })
    );
    const { getByTestId } = render(<View />);

    await waitFor(() => expect(getByTestId("home-error")).toBeInTheDocument());
  });
});
