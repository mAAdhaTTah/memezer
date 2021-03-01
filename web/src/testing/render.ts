import { render as rtlRender } from "@testing-library/react";
import { renderHook as tlRenderHook } from "@testing-library/react-hooks/dom";
import { Kit as BaseKit } from "react-testing-kit";
import { TestProvider } from "./provider";

export const renderHook = <P, R>(cb: (props: P) => R) =>
  tlRenderHook<P, R>(cb, {
    wrapper: TestProvider,
  });

export const render = (element: React.ReactElement) =>
  rtlRender(element, {
    wrapper: TestProvider,
  });

export const Kit = BaseKit.withRender(render);
