import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { AppProvider } from "./AppProvider";

describe("App", () => {
  it("should render main element", () => {
    render(<App />, {
      wrapper: AppProvider,
    });
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
