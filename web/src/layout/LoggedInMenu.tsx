import React from "react";
import { MenuLink } from "./links";

export const LoggedInMenu: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  return (
    <MenuLink onClick={onMenuClick} to={"#"}>
      Account Settings
    </MenuLink>
  );
};
