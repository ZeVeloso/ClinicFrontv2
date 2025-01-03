import React from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";

interface MenuItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

interface MobileDrawerMenuProps {
  menuItems: MenuItem[];
}

export const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({
  menuItems,
}) => {
  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.label} component="a" href={item.link}>
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
};
