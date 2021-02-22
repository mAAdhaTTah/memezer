import React from "react";
import { Typography, Box } from "@material-ui/core";
import { ApiError } from "../api";

export const ErrorView: React.FC<{ error: ApiError }> = ({ error }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      data-testid="home-error"
    >
      <Typography align="center" component="h3" variant="h4" color="error">
        {error.message}
      </Typography>
    </Box>
  );
};
