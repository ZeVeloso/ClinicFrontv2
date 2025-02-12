import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { appMenuItems, profileMenuItems } from "../../config/menuConfig";
import MenuItems from "./MenuItems";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  mobileOpen: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, toggleDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const drawerContent = (
    <Stack sx={{ height: "100%" }}>
      {/* Header with Background Image */}
      <Box
        sx={{
          position: "relative",
          p: 2,
          textAlign: "center",
          height: 80, // Adjust as needed
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src="src\assets\Clinic+.png" // Replace with the actual image path
          alt="Background"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1, // Behind the text
            opacity: 0.2, // Make the image less prominent
          }}
        />
        {/* Text on Top */}
        <Typography
          variant="h6"
          sx={{
            position: "relative",
            zIndex: 2, // Above the background
            fontWeight: "bold",
          }}
        >
          Clinic +
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <MenuItems items={appMenuItems} />
      </Box>
      <Divider />
      <Box>
        <MenuItems items={profileMenuItems} />
      </Box>
      <Divider />
      {user && (
        <Stack direction="row" sx={{ p: 2, alignItems: "center" }}>
          <Avatar alt={user.name} src="/static/images/avatar/7.jpg" />
          <Box sx={{ ml: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 150,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.email}
            </Typography>
          </Box>
        </Stack>
      )}
      <Divider />
      <Stack sx={{ p: 2 }}>
        <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
          Logout
        </Button>
      </Stack>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "70vw",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          position: "fixed", // Make sure the sidebar is fixed
          height: "100%",
          zIndex: 1000, // Ensure it is on top of the page content
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
