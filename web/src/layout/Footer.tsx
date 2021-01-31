import * as React from "react";
import {
  makeStyles,
  BottomNavigation,
  BottomNavigationAction,
  Grid,
} from "@material-ui/core";
import { CloudUpload, Person, Assignment } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { LOGIN, REGISTER, useAuth } from "../auth";
import { UPLOAD } from "../upload";
import { PaperContainer } from "./PaperContainer";

const useStyles = makeStyles({
  navigation: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  action: {},
});

export const Footer: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const user = useAuth();

  return (
    <PaperContainer>
      <Grid component="footer" container>
        <BottomNavigation
          value={history.location.pathname}
          onChange={(_event, newValue) => {
            history.push(newValue);
          }}
          showLabels
          className={classes.navigation}
        >
          {user.token ? (
            <BottomNavigationAction
              value={UPLOAD}
              label="Upload"
              icon={<CloudUpload />}
              className={classes.action}
            />
          ) : (
            [
              <BottomNavigationAction
                key={0}
                value={LOGIN}
                label="Login"
                icon={<Person />}
                className={classes.action}
              />,
              <BottomNavigationAction
                key={1}
                value={REGISTER}
                label="Register"
                icon={<Assignment />}
                className={classes.action}
              />,
            ]
          )}
        </BottomNavigation>
      </Grid>
    </PaperContainer>
  );
};
