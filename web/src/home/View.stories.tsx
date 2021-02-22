import * as React from "react";
import { Server, Response } from "miragejs";
import { View } from "./View";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Home/View",
};

export const LoggedInError = () => <View />;
LoggedInError.parameters = {
  user: {
    status: "logged-in",
  },
  mirage: {
    modify(server: Server) {
      server.get(
        "/memes",
        () => new Response(500, {}, { message: "Server is down" })
      );
    },
  },
};

export const LoggedInEmpty = () => <View />;
LoggedInEmpty.parameters = {
  user: {
    status: "logged-in",
  },
  mirage: {},
};

export const LoggedInList = () => <View />;
LoggedInList.parameters = {
  user: {
    status: "logged-in",
  },
  mirage: {
    modify(server: Server) {
      server.createList("meme", 10);
    },
  },
};

export const LoggedOut = () => <View />;
LoggedOut.parameters = {
  user: {
    status: "logged-out",
  },
};
