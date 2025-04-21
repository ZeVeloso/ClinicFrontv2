import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import SubscriptionProtectedRoute from "@features/subscription/components/SubscriptionProtectedRoute";
import { SubscriptionProvider } from "@features/subscription/hooks/useSubscription";
//import Navbar from "./components/navigation/NavBar";
import SignupPage from "@features/auth/pages/SignupPage";
import LoginPage from "@features/auth/pages/LoginPage";

import RouteErrorBoundary from "./components/RouteErrorBoundary";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import MainLayout from "./components/layout/MainLayout";

import AppointmentPage from "@features/appointments/pages/AppointmentPage";
const AppointmentsPage = lazy(
  () => import("@features/appointments/pages/AppointmentsPage")
);

import LandingPage from "@/features/profile/pages/LandingPage";

import ForgotPasswordPage from "@features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@features/auth/pages//ResetPasswordPage";

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage")
);

const PatientsPage = lazy(
  () => import("@features/patients/pages/PatientsPage")
);
const PatientPage = lazy(() => import("@features/patients/pages/PatientPage"));

const ManagementPage = lazy(
  () => import("@features/management/pages/ManagementPage")
);
const SettingsPage = lazy(
  () => import("@/features/profile/pages/SettingsPage")
);

const CheckoutSuccessPage = lazy(
  () => import("@features/subscription/pages/CheckoutSuccessPage")
);
const SubscriptionPage = lazy(
  () => import("@features/subscription/pages/SubscriptionPage")
);

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
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
