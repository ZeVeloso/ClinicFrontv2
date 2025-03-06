import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";
import { useAuth } from "../../../contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

interface SubscriptionProtectedRouteProps {
  children: React.ReactNode;
  requiredFeatures?: string[];
  redirectTo?: string;
}

/**
 * A route component that restricts access based on subscription status and features
 *
 * @param children - The components to render if access is granted
 * @param requiredFeatures - Optional array of feature keys required to access this route
 * @param redirectTo - Optional redirect path (defaults to /app/settings/subscription)
 */
const SubscriptionProtectedRoute: React.FC<SubscriptionProtectedRouteProps> = ({
  children,
  requiredFeatures = [],
  redirectTo = "/app/settings/subscription",
}) => {
  const { isAuthenticated } = useAuth();
  const {
    loading,
    hasActiveSubscription,
    hasFeatureAccess,
    isSubscriptionExpired,
  } = useSubscription();
  const location = useLocation();

  // First check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading state while checking subscription
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Check if subscription is active
  if (!hasActiveSubscription() || isSubscriptionExpired()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has access to all required features
  const hasAccess =
    requiredFeatures.length === 0 ||
    requiredFeatures.every((feature) => hasFeatureAccess(feature));

  if (!hasAccess) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default SubscriptionProtectedRoute;
