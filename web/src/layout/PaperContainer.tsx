import React from "react";
import { Container, makeStyles, Paper } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 1),
  },
}));

export const PaperContainer: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper>{children}</Paper>
    </Container>
  );
};
