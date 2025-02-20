import { alpha } from "@mui/material/styles";

import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

interface MenuItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

interface MenuItemsProps {
  items: MenuItem[];
  currentPath: string;
}

const MenuItems: React.FC<MenuItemsProps> = ({ items, currentPath }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    navigate(link);
  };

  return (
    <List sx={{ px: 2 }}>
      {items.map(({ label, link, icon }) => {
        const isActive = currentPath === link;
        return (
          <ListItem
            key={label}
            onClick={() => handleNavigation(link)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: isActive ? 'primary.main' : 'text.primary',
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': {
                bgcolor: isActive 
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.action.hover, 0.04),
              },
              transition: 'all 0.2s',
            }}
          >
            {icon && (
              <ListItemIcon
                sx={{
                  color: isActive ? 'primary.main' : 'inherit',
                  minWidth: 40,
                }}
              >
                {icon}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
          </ListItem>
        )}
      )}
    </List>
  );
};

export default MenuItems;
