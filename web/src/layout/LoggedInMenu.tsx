import React from "react";
import { MenuLink } from "./links";

export const LoggedInMenu: React.FC<{
  onMenuClick: () => void;
}> = React.forwardRef(({ onMenuClick }, _ref) => {
  return (
    <MenuLink onClick={onMenuClick} to={"#"}>
      Account Settings
    </MenuLink>
  );
});
