import React from "react";
import { Box } from "@mui/material";
import Navbar from "../navigation/NavBar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* <Header /> */}
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, md: 3 },
          pt: { xs: 2, md: 0 },
          overflow: "auto",
          marginLeft: { xs: 0, md: "240px" }, // Adjust for mobile and desktop
          marginTop: { xs: "6%", md: 0 },
          transition: "margin-left 0.3s ease", // Smooth transition when opening/closing the sidebar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
