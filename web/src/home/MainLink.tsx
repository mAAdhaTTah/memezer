import React, { forwardRef } from "react";
import { Link as LinkUi } from "@material-ui/core";

export const MainLink: React.ForwardRefExoticComponent<{
  href: string;
}> = forwardRef(({ children, href }, ref) => {
  return (
    <LinkUi innerRef={ref} href={href} variant="body2" color="secondary">
      {children}
    </LinkUi>
  );
});
