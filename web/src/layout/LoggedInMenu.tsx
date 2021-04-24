import React from "react";
import { UPLOAD } from "../upload";
import { MenuLink } from "./links";

export const LoggedInMenu: React.FC<{
  onMenuClick: () => void;
}> = React.forwardRef(({ onMenuClick }, _ref) => {
  return (
    <MenuLink onClick={onMenuClick} to={UPLOAD}>
      Upload
    </MenuLink>
  );
});
