import { useLayoutEffect, useMemo } from "react";
import { addDecorator } from "@storybook/react";
import { makeDecorator } from "@storybook/addons";
import withRouter from "storybook-react-router";
import { action } from "@storybook/addon-actions";
import { createMockServer } from "../src/testing/server";
import { SwrConfigProvider } from "../src/api/config";
import { ClientContext } from "../src/api/client";
import { cache } from "swr";
import axios from "axios";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

const API_BASE = "http://api.memezer.test";

const withMirageServer = makeDecorator({
  name: "withMirageServer",
  parameterName: "mirage",
  wrapper: (storyFn, context, { parameters }) => {
    useLayoutEffect(() => {
      const server = createMockServer({ baseURL: API_BASE });
      parameters?.modify?.(server);

      return () => {
        server.shutdown();
        cache.clear();
      };
    }, [parameters?.modify]);

    return storyFn(context);
  },
});

const withClientConfig = makeDecorator({
  name: "withClientConfig",
  parameterName: "client",
  wrapper: (storyFn, context) => {
    const client = useMemo(
      () => ({
        token: parameters?.status === "logged-in" ? "faketoken" : null,
        login: action("user#login"),
        register: action("user#register"),
        api: axios.create({
          baseURL: API_BASE,
        }),
      }),
      [parameters?.status]
    );
    return (
      <ClientContext.Provider value={client}>
        <SwrConfigProvider config={{ dedupingInterval: 0 }}>
          {storyFn(context)}
        </SwrConfigProvider>
      </ClientContext.Provider>
    );
  },
});

addDecorator(withMirageServer());
addDecorator(withClientConfig());
addDecorator(withRouter());
