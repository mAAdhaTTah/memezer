import { waitFor } from "@testing-library/react";
import { Response } from "miragejs";
import * as React from "react";
import { useAuth } from "../auth";
import { render, setupServerInTests } from "../testing";
import { View } from "./View";

jest.mock("../auth", () => {
  const auth = jest.requireActual("../auth");
  return {
    ...auth,
    useAuth: jest.fn(auth.useAuth),
  };
});

describe("home#View", () => {
  setupServerInTests();

  it("should show the logged out view with no token", () => {
    (useAuth as jest.Mock).mockReturnValue({
      token: null,
    });
    const { getByTestId } = render(<View />);

    expect(getByTestId("home-loggedout")).toBeInTheDocument();
  });

  it("should render the empty view with no memes", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      // TODO(mAAdhaTTah) create a token generator to share w/ Mirage
      token: "customtoken",
    });
    const { getByTestId } = render(<View />);

    await waitFor(() => expect(getByTestId("home-empty")).toBeInTheDocument());
  });

  it("should render the success view with loaded memes", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      // TODO(mAAdhaTTah) create a token generator to share w/ Mirage
      token: "customtoken",
    });
    server.createList("meme", 10);
    const { getByTestId } = render(<View />);

    await waitFor(() =>
      expect(getByTestId("home-success")).toBeInTheDocument()
    );
  });

  it("should render the error view when backend returns error", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      // TODO(mAAdhaTTah) create a token generator to share w/ Mirage
      token: "customtoken",
    });

    server.get(
      "/memes",
      () => new Response(500, {}, { message: "Server is down" })
    );
    const { getByTestId } = render(<View />);

    await waitFor(() => expect(getByTestId("home-error")).toBeInTheDocument());
  });
});
