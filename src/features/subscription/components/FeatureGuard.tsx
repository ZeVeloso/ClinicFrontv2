import React, { ReactNode } from "react";
import { useSubscription } from "../hooks/useSubscription";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Tooltip,
  alpha,
  useTheme,
  SxProps,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Props interface with descriptive parameter names
interface FeatureGuardProps {
  /** The feature key(s) required to access the content */
  feature: string | string[];

  /** The content to render if the user has access to the feature */
  children: ReactNode;

  /** Custom message to display when access is denied */
  fallbackMessage?: string;

  /** Whether to show a fallback UI when access is denied (true) or render nothing (false) */
  showFallback?: boolean;

  /** Whether to show an upgrade button in the fallback UI */
  showUpgradeButton?: boolean;

  /** Custom styles for the fallback container */
  fallbackSx?: SxProps;
}

/**
 * A component that conditionally renders content based on subscription feature access.
 * If the user doesn't have access to the required feature(s), it can either:
 * 1. Show a fallback UI with an upgrade prompt
 * 2. Render nothing
 */
const FeatureGuard: React.FC<FeatureGuardProps> = ({
  feature,
  children,
  fallbackMessage = "This feature requires a higher subscription plan",
  showFallback = true,
  showUpgradeButton = true,
  fallbackSx = {},
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { hasFeatureAccess, hasActiveSubscription } = useSubscription();

  // Convert single feature to array for consistent handling
  const requiredFeatures = Array.isArray(feature) ? feature : [feature];

  // Check if user has access to all required features
  const hasAccess = requiredFeatures.every((f) => hasFeatureAccess(f));

  // If user has access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no fallback UI is requested, render nothing
  if (!showFallback) {
    return null;
  }

  // Otherwise, render the fallback UI
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
        backgroundColor: alpha(theme.palette.warning.main, 0.05),
        ...fallbackSx,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <LockIcon color="warning" />
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {fallbackMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hasActiveSubscription()
                ? "Upgrade your plan to access this feature"
                : "Subscribe to a plan to access this feature"}
            </Typography>
          </Box>
        </Stack>

        {showUpgradeButton && (
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/app/settings/subscription")}
          >
            {hasActiveSubscription() ? "Upgrade Plan" : "Subscribe Now"}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

/**
 * A component that wraps elements and disables them if the user doesn't have feature access.
 * Useful for UI elements that should be visible but disabled for non-subscribers.
 */
export const FeatureDisabled: React.FC<
  FeatureGuardProps & { disabledSx?: SxProps }
> = ({
  feature,
  children,
  fallbackMessage = "This feature requires a higher subscription plan",
  disabledSx = {},
}) => {
  const { hasFeatureAccess } = useSubscription();

  // Convert single feature to array
  const requiredFeatures = Array.isArray(feature) ? feature : [feature];

  // Check if user has access to all required features
  const hasAccess = requiredFeatures.every((f) => hasFeatureAccess(f));

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Tooltip title={fallbackMessage}>
      <Box
        sx={{
          opacity: 0.5,
          pointerEvents: "none",
          cursor: "not-allowed",
          position: "relative",
          ...disabledSx,
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

export default FeatureGuard;
