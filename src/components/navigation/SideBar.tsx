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
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { alpha } from "@mui/material/styles";

import { appMenuItems, profileMenuItems } from "../../config/menuConfig";
import MenuItems from "./MenuItems";
import { useAuth } from "../../contexts/AuthContext";
import clinicLogo from "../../assets/Clinic+.png";

interface SidebarProps {
  mobileOpen: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, toggleDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const location = useLocation();

  const drawerContent = (
    <Stack
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box
            component="img"
            src={clinicLogo}
            alt="Clinic+"
            sx={{
              height: 40,
              width: "auto",
            }}
          />
        </motion.div>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Clinic +
        </Typography>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 2 }}>
        <MenuItems 
          items={appMenuItems} 
          currentPath={location.pathname}
        />
      </Box>

      <Divider />

      {/* Profile Section */}
      <Box sx={{ p: 2 }}>
        <MenuItems 
          items={profileMenuItems}
          currentPath={location.pathname}
        />
      </Box>

      <Divider />

      {/* User Info & Logout */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              mb: 2,
            }}
          >
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              sx={{
                width: 40,
                height: 40,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            fullWidth
            color="error"
            startIcon={<LogoutRoundedIcon />}
            onClick={logout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            Logout
          </Button>
        </Box>
      )}
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
            width: drawerWidth,
            boxShadow: theme.shadows[8],
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
          boxSizing: "border-box",
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          height: "100%",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;