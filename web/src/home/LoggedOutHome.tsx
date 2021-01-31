import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography } from "@material-ui/core";
import { MainLink } from "./MainLink";
import { LOGIN, REGISTER } from "../auth";

export const LoggedOutHome: React.FC = () => {
  return (
    <Grid container alignContent="center" direction="column">
      <Box mb={8}>
        <Typography component="h4" variant="h4" align="center">
          You are not logged in
        </Typography>
      </Box>
      <Grid
        container
        alignContent="center"
        justify="space-around"
        direction="row"
      >
        <Link to={LOGIN} component={MainLink}>
          Login
        </Link>
        <Link to={REGISTER} component={MainLink}>
          Register
        </Link>
      </Grid>
    </Grid>
  );
};
