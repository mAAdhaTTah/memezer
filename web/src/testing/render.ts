import { renderHook as tlRenderHook } from "@testing-library/react-hooks";
import { TestProvider } from "./provider";

export const renderHook = <P, R>(cb: (props: P) => R) =>
  tlRenderHook<P, R>(cb, {
    wrapper: TestProvider,
  });
