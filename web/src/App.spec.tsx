import React from "react";
import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { App } from "./App";

describe("App", () => {
  it("should render main element", () => {
    render(<App />, {
      wrapper: HashRouter,
    });
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
