import * as React from "react";
import { Footer } from "./Footer";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Layout/Footer",
};

export const LoggedIn = () => <Footer />;
LoggedIn.parameters = {
  user: {
    status: "logged-in",
  },
};

export const LoggedOut = () => <Footer />;
LoggedOut.parameters = {
  user: {
    status: "logged-out",
  },
};
