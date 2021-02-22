import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { MainLink } from "./MainLink";
import { LOGIN, REGISTER } from "../auth";

export const LoggedOutView: React.FC = () => {
  return (
    <Grid
      container
      alignContent="center"
      direction="column"
      data-testid="home-loggedout"
    >
      <Box mb={8}>
        <Typography component="h4" variant="h4" align="center">
          Welcome to Memezer
        </Typography>
      </Box>
      <Grid
        container
        alignContent="center"
        justify="space-around"
        direction="row"
      >
        <MainLink to={LOGIN}>Login</MainLink>
        <MainLink to={REGISTER}>Register</MainLink>
      </Grid>
    </Grid>
  );
};
