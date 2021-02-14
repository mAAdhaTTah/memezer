import { addDecorator } from "@storybook/react";
import { makeDecorator } from "@storybook/addons";
import withRouter from "storybook-react-router";
import { action } from "@storybook/addon-actions";
import { AuthContext } from "../src/auth/token";
import { SwrConfigProvider } from "../src/api/config";
import { ClientProvider } from "../src/api/client";
import { cache } from "swr";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};


const withApiConfig = makeDecorator({
  name: "withApiConfig",
  wrapper: (storyFn, context) => {
    useEffect(() => {
      return () => cache.clear();
    });
    return (
      <ClientProvider>
        <SwrConfigProvider>{storyFn(context)}</SwrConfigProvider>
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

addDecorator(withApiConfig());
addDecorator(withUser());
addDecorator(withRouter());
