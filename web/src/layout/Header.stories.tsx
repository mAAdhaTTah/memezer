import { Header } from "./Header";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Layout/Header",
};

export const LoggedIn = () => <Header />;
LoggedIn.parameters = {
  user: {
    status: "logged-in",
  },
};

export const LoggedOut = () => <Header />;
LoggedOut.parameters = {
  user: {
    status: "logged-out",
  },
};
