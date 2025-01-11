import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
//import Navbar from "./components/Navbar/Navbar";
import Navbar from "./components/SideMenu/NavBar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import PatientsPage from "./pages/PatientsPage";
import PatientPage from "./pages/PatientPage";
// Protected layout updated to use MUI styling
// Updated ProtectedLayout component
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
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

// Routes setup with MUI
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <DashboardPage />
        </ProtectedLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <DashboardPage />
        </ProtectedLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/patients",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <PatientsPage />
        </ProtectedLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/patients/:id",
    element: (
      <ProtectedRoute>
        <ProtectedLayout>
          <PatientPage />
        </ProtectedLayout>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <RouteErrorBoundary />,
  },
]);

const AppRoutes: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={routes} />
  </ThemeProvider>
);

export default AppRoutes;
