import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useSubscription } from "../hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatters";

interface SubscriptionStatusProps {
  showManageButton?: boolean;
  compact?: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  showManageButton = true,
  compact = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentSubscription, loading, plans, hasActiveSubscription } =
    useSubscription();

  // Find current plan details
  const currentPlan = currentSubscription
    ? plans.find((plan) => {
        const currentPriceId = currentSubscription.items[0]?.price.id;
        return plan.priceId === currentPriceId;
      })
    : null;

  const getStatusInfo = () => {
    if (!currentSubscription) {
      return {
        label: "No Subscription",
        color: "error" as const,
        icon: <CancelIcon color="error" />,
        message: "You don't have an active subscription",
      };
    }

    if (currentSubscription.status === "active") {
      return {
        label: "Active",
        color: "success" as const,
        icon: <CheckCircleIcon color="success" />,
        message: `Your ${currentPlan?.name} plan is active`,
      };
    } else if (currentSubscription.status === "trialing") {
      return {
        label: "Trial",
        color: "info" as const,
        icon: <CheckCircleIcon color="info" />,
        message: `Your ${currentPlan?.name} trial is active`,
      };
    } else if (currentSubscription.status === "paused") {
      return {
        label: "Paused",
        color: "warning" as const,
        icon: <PauseIcon color="warning" />,
        message: `Your subscription is currently paused`,
      };
    } else {
      return {
        label: "Canceled",
        color: "error" as const,
        icon: <CancelIcon color="error" />,
        message: `Your subscription has been canceled`,
      };
    }
  };

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

  const statusInfo = getStatusInfo();

  return (
    <Box
      sx={{
        p: compact ? 1 : 2,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette[statusInfo.color].main, 0.08),
        border: `1px solid ${alpha(theme.palette[statusInfo.color].main, 0.2)}`,
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
            {!compact && (
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
