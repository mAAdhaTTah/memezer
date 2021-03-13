import React from "react";
import { Container } from "@material-ui/core";
import { useClient } from "../api";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const View: React.FC = () => {
  const { isAuthenticated } = useClient();

  return (
    <Container>
      {isAuthenticated ? <LoggedInView /> : <LoggedOutView />}
    </Container>
  );
};
