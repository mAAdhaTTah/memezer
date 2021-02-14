// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";
import { Server } from "miragejs";
import { cache } from "swr";
import { createMockServer } from "./testing/server";

declare global {
  const server: Server;
}

beforeEach(() => {
  createMockServer({ environment: "test" });
});

afterEach(async () => {
  server.shutdown();
  await waitFor(() => cache.clear());
});
