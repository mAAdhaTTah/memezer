import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Menu,
  Typography,
} from "@material-ui/core";
import { Person, Home } from "@material-ui/icons";
import { useClient } from "../api";
import { LOGIN } from "../auth";
import { HOME } from "../home";
import { LoggedInMenu } from "./LoggedInMenu";
import { HeaderLink } from "./links";
import { PaperContainer } from "./PaperContainer";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(1, 4),
  },
  menu: {},
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export const Header: React.FC = () => {
  const { isAuthenticated } = useClient();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const onClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  return (
    <PaperContainer>
      <Grid
        component="header"
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.header}
      >
        <Box display="flex" flexGrow="1">
          <HeaderLink to={HOME}>
            <Box display="flex" alignItems="end">
              <Home className={classes.icon} /> Home
            </Box>
          </HeaderLink>
        </Box>
        <Box display="flex" flexGrow="0">
          <Typography component="h1" variant="h5">
            Memezer
          </Typography>
        </Box>
        <Box
          flexGrow="1"
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          className={classes.menu}
        >
          {isAuthenticated ? (
            <>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                aria-label="Open Menu"
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
              >
                <Person />
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onClose}
              >
                <LoggedInMenu onMenuClick={onClose} />
              </Menu>
            </>
          ) : (
            <Box padding="4px 12px">
              <HeaderLink to={LOGIN}>Login</HeaderLink>
            </Box>
          )}
        </Box>
      </Grid>
    </PaperContainer>
  );
};
