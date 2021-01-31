import { addDecorator } from "@storybook/react";
import { makeDecorator } from "@storybook/addons";
import withRouter from "storybook-react-router";
import { action } from "@storybook/addon-actions";
import { AuthContext } from "../src/auth/token";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

const withUser = makeDecorator({
  namee: "withUser",
  parameterName: "user",
  wrapper: (storyFn, context, { parameters }) => {
    const api = {
      token: parameters.status === "logged-in" ? "faketoken" : null,
      login: action("user#login"),
      register: action("user#register"),
    };

    return (
      <AuthContext.Provider value={api}>
        {storyFn(context)}
      </AuthContext.Provider>
    );
  },
});

addDecorator(withUser());
addDecorator(withRouter());
