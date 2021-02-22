import React from "react";
import { Container } from "@material-ui/core";
import { useAuth } from "../auth";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const View: React.FC = () => {
  const { token } = useAuth();

  return <Container>{token ? <LoggedInView /> : <LoggedOutView />}</Container>;
};
