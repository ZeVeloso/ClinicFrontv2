import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DesktopMenu } from "./DesktopMenu";
import { MobileDrawerMenu } from "./MobileDrawerMenu";
import { profileMenuItems, appMenuItems } from "../../config/menuConfig";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setMobileOpen(open);
    };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand Text */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Clinic +
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <DesktopMenu menuItems={appMenuItems} />
          </Box>

          {/* Profile Dropdown */}
          <Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              aria-label="profile options"
            >
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom", // Change from 'top' to 'bottom'
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top", // Keep 'top' to make sure it stays anchored from the button
                horizontal: "right",
              }}
            >
              {profileMenuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={Link} // This tells MenuItem to act as a Link
                  to={item.link}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        sx={{ display: { md: "none" } }}
      >
        <Box
          sx={{
            width: 250,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              py: 2,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            Clinic +
          </Typography>
          <Divider />
          <MobileDrawerMenu menuItems={appMenuItems} />
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
