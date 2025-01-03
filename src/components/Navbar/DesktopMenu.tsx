import React from "react";
import { Button } from "@mui/material";

interface MenuItem {
  label: string;
  link: string;
}

interface DesktopMenuProps {
  menuItems: MenuItem[];
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ menuItems }) => {
  return (
    <>
      {menuItems.map((item) => (
        <Button
          key={item.label}
          color="inherit"
          href={item.link}
          sx={{ ml: 2 }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );
};
