import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { Theme, alpha } from "@mui/material";
import {
  Subscription,
  Plan,
  PaymentInfo,
  SubscriptionStatusInfo,
} from "../types";

/**
 * Gets the next payment information for display
 */
export const getPaymentInfo = (
  currentSubscription: Subscription | null
): PaymentInfo | null => {
  if (
    !currentSubscription ||
    !currentSubscription.items?.[0]?.price?.unitPrice
  ) {
    return null;
  }

  const amount =
    parseFloat(currentSubscription.items[0].price.unitPrice.amount || "0") /
    100;
  const currency = currentSubscription.items[0].price.unitPrice.currencyCode;

  if (currentSubscription.scheduledChange?.action === "cancel") {
    return {
      title: "Subscription Ends",
      date: currentSubscription.scheduledChange.effectiveAt,
      amount,
      currency,
    };
  }

  if (currentSubscription.nextBilledAt) {
    return {
      title: "Next Payment",
      date: currentSubscription.nextBilledAt,
      amount,
      currency,
    };
  }

  return null;
};

/**
 * Gets information about the current plan
 */
export const getCurrentPlan = (
  currentSubscription: Subscription | null,
  plans: Plan[]
): Plan | null => {
  if (!currentSubscription || !currentSubscription.items?.[0]?.price?.id) {
    return null;
  }

  const currentPriceId = currentSubscription.items[0].price.id;
  return plans.find((plan) => plan.priceId === currentPriceId) || null;
};

/**
 * Gets UI information for a subscription status
 */
export const getSubscriptionStatusInfo = (
  subscription: Subscription | null,
  currentPlan: Plan | null,
  theme: Theme
): SubscriptionStatusInfo => {
  if (!subscription) {
    return {
      label: "No Subscription",
      color: "error",
      icon: <CancelIcon color="error" />,
      message: "You don't have an active subscription",
    };
  }

  if (subscription.status === "active") {
    if (subscription.scheduledChange?.action === "cancel") {
      return {
        label: "Active - Canceling Soon",
        color: "warning",
        icon: <CheckCircleIcon />,
        bgColor: alpha(theme.palette.warning.main, 0.1),
        borderColor: theme.palette.warning.main,
        message: subscription.scheduledChange.effectiveAt
          ? `Your subscription will be canceled on ${new Date(
              subscription.scheduledChange.effectiveAt
            ).toLocaleDateString()}`
          : "Your subscription is scheduled for cancellation",
      };
    }

    return {
      label: "Active",
      color: "success",
      icon: <CheckCircleIcon color="success" />,
      bgColor: alpha(theme.palette.success.main, 0.1),
      borderColor: theme.palette.success.main,
      message: `Your ${currentPlan?.name} plan is active`,
    };
  } else if (subscription.status === "trialing") {
    return {
      label: "Trial",
      color: "info",
      icon: <AutorenewIcon />,
      bgColor: alpha(theme.palette.info.main, 0.1),
      borderColor: theme.palette.info.main,
      message: `Your ${currentPlan?.name} trial is active`,
    };
  } else if (subscription.status === "paused") {
    return {
      label: "Paused",
      color: "warning",
      icon: <PauseIcon color="warning" />,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      borderColor: theme.palette.warning.main,
      message: `Your subscription is currently paused`,
    };
  } else {
    return {
      label: "Canceled",
      color: "error",
      icon: <CancelIcon color="error" />,
      bgColor: alpha(theme.palette.error.main, 0.1),
      borderColor: theme.palette.error.main,
      message: `Your subscription has been canceled`,
    };
  }
};
