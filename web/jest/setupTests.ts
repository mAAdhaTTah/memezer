// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { banConsole } from "../src/testing";

banConsole();

jest.mock("../src/config");

jest.spyOn(window, "scrollTo").mockImplementation(() => void 0);
