import React from "react";
import { Link } from "react-router-dom";
import { makeStyles, MenuItem, Typography } from "@material-ui/core";

const useClasses = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    borderBottom: `1px solid transparent`,
    "&:focus,&:hover": {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export const HeaderLink: React.FC<{ to: string }> = ({ to, children }) => {
  const classes = useClasses();
  return (
    <Link to={to} className={classes.link}>
      <Typography component="span" variant="subtitle1">
        {children}
      </Typography>
    </Link>
  );
};

export const MenuLink: React.FC<{ onClick?: () => void; to: string }> = ({
  onClick,
  to,
  children,
}) => {
  return (
    <MenuItem onClick={onClick}>
      <HeaderLink to={to}>{children}</HeaderLink>
    </MenuItem>
  );
};
