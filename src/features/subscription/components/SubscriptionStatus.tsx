import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useSubscription } from "../hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatters";
import {
  getCurrentPlan,
  getSubscriptionStatusInfo,
} from "../utils/subscription-utils";

interface SubscriptionStatusProps {
  /** Whether to show the manage button to navigate to subscription page */
  showManageButton?: boolean;

  /** Whether to display in compact mode (reduced content) */
  compact?: boolean;
}

/**
 * Displays the current subscription status with visual indicators
 */
const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  showManageButton = true,
  compact = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentSubscription, loading, plans, hasActiveSubscription } =
    useSubscription();

  // Find current plan details
  const currentPlan = getCurrentPlan(currentSubscription, plans);

  // Get subscription status information for UI display
  const statusInfo = getSubscriptionStatusInfo(
    currentSubscription,
    currentPlan,
    theme
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: compact ? 1 : 2,
        borderRadius: 2,
        backgroundColor: statusInfo.bgColor || theme.palette.background.paper,
        border: `1px solid ${statusInfo.borderColor || theme.palette.divider}`,
      }}
    >
      <Stack
        direction={compact ? "column" : "row"}
        spacing={compact ? 1 : 2}
        alignItems={compact ? "flex-start" : "center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {statusInfo.icon}
          <Box>
            <Typography
              variant={compact ? "body2" : "body1"}
              fontWeight={600}
              color={`${statusInfo.color}.main`}
            >
              {statusInfo.label}
            </Typography>
            {!compact && statusInfo.message && (
              <Typography variant="body2" color="text.secondary">
                {statusInfo.message}
              </Typography>
            )}
          </Box>
        </Stack>

        {currentSubscription && !compact && (
          <Typography variant="body2" color="text.secondary">
            {currentSubscription.scheduledChange?.action === "cancel"
              ? `Ends on ${formatDate(
                  currentSubscription.scheduledChange.effectiveAt
                )}`
              : hasActiveSubscription() && currentSubscription.nextBilledAt
                ? `Next billing: ${formatDate(currentSubscription.nextBilledAt)}`
                : ""}
          </Typography>
        )}

        {showManageButton && (
          <Button
            variant={compact ? "text" : "outlined"}
            color={statusInfo.color}
            size={compact ? "small" : "medium"}
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/app/settings/subscription")}
          >
            {hasActiveSubscription() ? "Manage" : "Subscribe"}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default SubscriptionStatus;
