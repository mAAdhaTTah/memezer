import { useLayoutEffect, useMemo } from "react";
import { addDecorator } from "@storybook/react";
import { makeDecorator } from "@storybook/addons";
import withRouter from "storybook-react-router";
import { action } from "@storybook/addon-actions";
import { AuthContext } from "../src/auth/token";
import { createMockServer } from "../src/testing/server";
import { SwrConfigProvider } from "../src/api/config";
import { ClientProvider } from "../src/api/client";
import { cache } from "swr";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

const withMirageServer = makeDecorator({
  name: "withMirageServer",
  parameterName: "mirage",
  wrapper: (storyFn, context, { parameters }) => {
    useLayoutEffect(() => {
      const server = createMockServer();
      parameters?.modify?.(server);

      return () => {
        server.shutdown();
        cache.clear();
      };
    }, [parameters?.modify]);

    return storyFn(context);
  },
});

const withApiConfig = makeDecorator({
  name: "withApiConfig",
  wrapper: (storyFn, context) => {
    return (
      <ClientProvider>
        <SwrConfigProvider config={{ dedupingInterval: 0 }}>
          {storyFn(context)}
        </SwrConfigProvider>
      </ClientProvider>
    );
  },
});

const withUser = makeDecorator({
  name: "withUser",
  parameterName: "user",
  wrapper: (storyFn, context, { parameters }) => {
    const api = useMemo(
      () => ({
        token: parameters?.status === "logged-in" ? "faketoken" : null,
        login: action("user#login"),
        register: action("user#register"),
      }),
      [parameters?.status]
    );

    return (
      <AuthContext.Provider value={api}>
        {storyFn(context)}
      </AuthContext.Provider>
    );
  },
});

addDecorator(withMirageServer());
addDecorator(withApiConfig());
addDecorator(withUser());
addDecorator(withRouter());
