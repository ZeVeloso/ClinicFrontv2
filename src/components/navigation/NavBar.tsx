import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Stack from "@mui/material/Stack";
import Sidebar from "./SideBar";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import clinicLogo from "../../assets/Clinic+.png";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          bgcolor: "primary.main",
          boxShadow: 3,
          backdropFilter: "blur(8px)",
          borderStyle: "solid",
          borderColor: "divider",
          borderWidth: "0 0 thin",
        }}
      >
        <Toolbar>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src={clinicLogo}
                alt="Logo"
                sx={{
                  height: 32,
                  width: "auto",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #2b3a67 30%, #496a81 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Clinic +
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton size="small" sx={{ color: "common.white" }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Avatar
                src={user?.avatarUrl}
                alt={user?.name}
                sx={{
                  width: 32,
                  height: 32,
                  border: 2,
                  borderColor: "common.white",
                }}
              />

              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: "common.white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Sidebar mobileOpen={mobileOpen} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Navbar;
