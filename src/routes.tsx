import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionProtectedRoute from "./features/subscription/components/SubscriptionProtectedRoute";
import { SubscriptionProvider } from "./features/subscription/hooks/useSubscription";
//import Navbar from "./components/navigation/NavBar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import RouteErrorBoundary from "./components/RouteErrorBoundary";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import MainLayout from "./components/layout/MainLayout";
import AppointmentPage from "./pages/AppointmentPage";
import LandingPage from "./pages/LandingPage";
//import Box from "@mui/material/Box";
// Protected layout updated to use MUI styling
// Updated ProtectedLayout component

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PatientsPage = lazy(() => import("./pages/PatientsPage"));
const PatientPage = lazy(() => import("./pages/PatientPage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const ManagementPage = lazy(() => import("./pages/ManagementPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CheckoutSuccessPage = lazy(() => import("./pages/CheckoutSuccessPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));

// Basic protected app (auth only)
const ProtectedApp: React.FC = () => (
  <ProtectedRoute>
    <SubscriptionProvider>
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </MainLayout>
    </SubscriptionProvider>
  </ProtectedRoute>
);

// Routes setup with MUI
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/app",
    element: <ProtectedApp />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: (
          <SubscriptionProtectedRoute>
            <DashboardPage />
          </SubscriptionProtectedRoute>
        ),
      },
      {
        path: "patients",
        element: (
          <SubscriptionProtectedRoute requiredFeatures={["Patient Management"]}>
            <PatientsPage />
          </SubscriptionProtectedRoute>
        ),
      },
      {
        path: "appointments",
        element: (
          <SubscriptionProtectedRoute
            requiredFeatures={["Appointment Scheduling"]}
          >
            <AppointmentsPage />
          </SubscriptionProtectedRoute>
        ),
      },
      {
        path: "patients/:id",
        element: (
          <SubscriptionProtectedRoute requiredFeatures={["Patient Management"]}>
            <PatientPage />
          </SubscriptionProtectedRoute>
        ),
      },
      {
        path: "appointments/:id",
        element: (
          <SubscriptionProtectedRoute
            requiredFeatures={["Appointment Scheduling"]}
          >
            <AppointmentPage />
          </SubscriptionProtectedRoute>
        ),
      },
      {
        path: "management",
        element: (
          <SubscriptionProtectedRoute
            requiredFeatures={["Analytics Dashboard"]}
          >
            <ManagementPage />
          </SubscriptionProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "settings/subscription",
        element: <SubscriptionPage />,
      },
      {
        path: "checkout/success",
        element: <CheckoutSuccessPage />,
      },
    ],
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
    path: "*",
    element: <RouteErrorBoundary />,
  },
]);

const AppRoutes: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default AppRoutes;
