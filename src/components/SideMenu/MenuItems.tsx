import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

interface MenuItemsProps {
  items: MenuItem[];
}

const MenuItems: React.FC<MenuItemsProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    navigate(link);
  };

  return (
    <List>
      {items.map(({ label, link, icon }) => (
        <ListItem
          key={label}
          onClick={() => handleNavigation(link)}
          sx={{
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover", // Use theme's hover color
            },
            transition: "background-color 0.3s ease", // Smooth transition
          }}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  );
};

export default MenuItems;
