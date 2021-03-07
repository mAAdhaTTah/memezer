import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { TestProvider } from "../testing";

describe("App", () => {
  it("should render main element", () => {
    render(<App />, {
      wrapper: TestProvider,
    });
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
