import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Stack from "@mui/material/Stack";
import Sidebar from "./SideBar";
import Box from "@mui/material/Box";
import clinicLogo from "../../assets/Clinic+.png";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ display: { md: "none" }, bgcolor: "primary.main" }}
      >
        <Toolbar>
          <Stack direction="row" sx={{ alignItems: "center", width: "100%" }}>
            <Box
              component="img"
              src={clinicLogo} // Replace with the actual image path
              alt="Logo"
              sx={{
                height: 32, // Adjust the height
                mr: 1, // Add some margin to the right of the image
              }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Clinic +
            </Typography>
            {/* Menu Button */}
            <IconButton onClick={toggleDrawer} sx={{ color: "common.white" }}>
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Sidebar mobileOpen={mobileOpen} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Navbar;
