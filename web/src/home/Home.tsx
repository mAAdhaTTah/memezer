import React from "react";
import { Container } from "@material-ui/core";
import { useAuth } from "../auth";
import { LoggedInHome } from "./LoggedInHome";
import { LoggedOutHome } from "./LoggedOutHome";

export const Home: React.FC = () => {
  const { token } = useAuth();

  return (
    <Container maxWidth="xs">
      {token ? <LoggedInHome /> : <LoggedOutHome />}
    </Container>
  );
};
