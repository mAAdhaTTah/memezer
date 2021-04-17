import React from "react";
import { Box } from "@material-ui/core";
import { useClient } from "../api";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const View: React.FC = () => {
  const { isAuthenticated } = useClient();

  return <Box>{isAuthenticated ? <LoggedInView /> : <LoggedOutView />}</Box>;
};
