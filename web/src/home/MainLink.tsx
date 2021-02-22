import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

export const MainLink: React.ForwardRefExoticComponent<{
  to: string;
  children: React.ReactNode;
}> = forwardRef(({ children, to }, ref) => {
  return (
    <Button
      innerRef={ref}
      to={to}
      color="primary"
      component={Link}
      variant="contained"
      size="large"
    >
      {children}
    </Button>
  );
});
