import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  alpha,
  Container,
  Chip,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  CalendarToday as CalendarIcon,
  CompareArrows as CompareArrowsIcon,
  CreditCard as CreditCardIcon,
  Autorenew as AutorenewIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useSubscription } from "../hooks/useSubscription";
import { Plan, Subscription } from "../types";
import { formatCurrency } from "../../../utils/formatters";

interface SubscriptionManagerProps {
  showTitle?: boolean;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  showTitle = true,
}) => {
  const theme = useTheme();
  const {
    plans,
    currentSubscription,
    loading,
    createCheckout,
    cancelSubscription,
    resumeSubscription,
    hasActiveSubscription,
  } = useSubscription();

  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({
    open: false,
    title: "",
    message: "",
    action: async () => {},
  });

  const currentPlan =
    currentSubscription && currentSubscription.items?.[0]
      ? plans.find(
          (plan) => plan.priceId === currentSubscription.items[0].price.id
        )
      : null;

  const handleSubscribe = async (plan: Plan) => {
    try {
      setProcessingAction(plan.id);
      console.log(
        `Initiating checkout for plan: ${plan.name} (${plan.priceId})`
      );

      if (checkoutContainerRef.current) {
        checkoutContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }

      await createCheckout(plan.priceId);
    } catch (error) {
      console.error("Error during checkout process:", error);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleCancelSubscription = () => {
    if (!currentSubscription) return;

    setConfirmDialog({
      open: true,
      title: "Cancel Subscription",
      message:
        "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.",
      action: async () => {
        setProcessingAction("cancel");
        try {
          await cancelSubscription(currentSubscription.id);
        } finally {
          setProcessingAction(null);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleResumeSubscription = () => {
    if (!currentSubscription) return;

    setConfirmDialog({
      open: true,
      title: "Resume Subscription",
      message: "Are you sure you want to resume your subscription?",
      action: async () => {
        setProcessingAction("resume");
        try {
          await resumeSubscription(currentSubscription.id);
        } finally {
          setProcessingAction(null);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const getSubscriptionStatus = (subscription: Subscription) => {
    if (subscription.status === "active") {
      if (subscription.scheduledChange?.action === "cancel") {
        return {
          label: "Active - Canceling Soon",
          color: "warning" as const,
          icon: <CheckCircleIcon />,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          borderColor: theme.palette.warning.main,
          message: subscription.scheduledChange.effectiveAt
            ? `Your subscription will be canceled on ${new Date(subscription.scheduledChange.effectiveAt).toLocaleDateString()}`
            : "Your subscription is scheduled for cancellation",
        };
      }
      return {
        label: "Active",
        color: "success" as const,
        icon: <CheckCircleIcon />,
        bgColor: alpha(theme.palette.success.main, 0.1),
        borderColor: theme.palette.success.main,
        message: null,
      };
    } else if (subscription.status === "trialing") {
      return {
        label: "Trial",
        color: "info" as const,
        icon: <AutorenewIcon />,
        bgColor: alpha(theme.palette.info.main, 0.1),
        borderColor: theme.palette.info.main,
        message: null,
      };
    } else {
      return {
        label: "Canceled",
        color: "error" as const,
        icon: <CancelIcon />,
        bgColor: alpha(theme.palette.error.main, 0.1),
        borderColor: theme.palette.error.main,
        message: "Your subscription has been canceled",
      };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const monthlyPlan = plans.find((plan) => plan.interval === "month");
  const yearlyPlan = plans.find((plan) => plan.interval === "year");

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        {showTitle && (
          <Box mb={4} textAlign="center">
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                fontSize: { xs: "1.75rem", sm: "2.5rem" },
              }}
            >
              {hasActiveSubscription()
                ? "Manage Your Subscription"
                : "Choose Your Plan"}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontWeight: 400,
                opacity: 0.8,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {hasActiveSubscription()
                ? "Review and manage your current subscription settings"
                : "Get full access to all features and start managing your clinic efficiently"}
            </Typography>
          </Box>
        )}

        {hasActiveSubscription() && currentSubscription && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 4,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.02),
              borderRadius: 3,
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Stack spacing={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                flexWrap="wrap"
                gap={2}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h5" fontWeight={700}>
                    Current Subscription
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {currentPlan?.name}
                  </Typography>
                  {getSubscriptionStatus(currentSubscription).message && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: getSubscriptionStatus(currentSubscription).color,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <InfoIcon fontSize="small" />
                      {getSubscriptionStatus(currentSubscription).message}
                    </Typography>
                  )}
                </Stack>
                <Chip
                  icon={getSubscriptionStatus(currentSubscription).icon}
                  label={getSubscriptionStatus(currentSubscription).label}
                  color={getSubscriptionStatus(currentSubscription).color}
                  size="small"
                  sx={{
                    height: 32,
                    backgroundColor:
                      getSubscriptionStatus(currentSubscription).bgColor,
                    borderColor:
                      getSubscriptionStatus(currentSubscription).borderColor,
                    "& .MuiChip-icon": {
                      color:
                        getSubscriptionStatus(currentSubscription).borderColor,
                    },
                  }}
                />
              </Box>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "background.default",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary" }}
                    >
                      <CalendarIcon fontSize="small" />
                      <Typography variant="body2">Billing Cycle</Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight={500}>
                      {currentPlan?.interval === "month"
                        ? "Monthly"
                        : "Yearly (20% off)"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "background.default",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary" }}
                    >
                      <CreditCardIcon fontSize="small" />
                      <Typography variant="body2">Next Payment</Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight={500}>
                      {currentSubscription.nextBilledAt
                        ? new Date(
                            currentSubscription.nextBilledAt
                          ).toLocaleDateString()
                        : "Not scheduled"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "background.default",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary" }}
                    >
                      <CompareArrowsIcon fontSize="small" />
                      <Typography variant="body2">Status</Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight={500}>
                      {getSubscriptionStatus(currentSubscription).label}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Box>
                {["active", "trialing"].includes(currentSubscription.status) ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelSubscription}
                    disabled={!!processingAction}
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    {processingAction === "cancel" ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Cancel Subscription"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResumeSubscription}
                    disabled={!!processingAction}
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      boxShadow: `0 4px 8px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                    }}
                  >
                    {processingAction === "resume" ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Resume Subscription"
                    )}
                  </Button>
                )}
              </Box>
            </Stack>
          </Paper>
        )}

        <Grid container spacing={2} justifyContent="center">
          {[monthlyPlan, yearlyPlan].map(
            (plan) =>
              plan && (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      p: { xs: 2, sm: 3 },
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      border: "2px solid",
                      borderColor: (theme) =>
                        plan.popular
                          ? theme.palette.primary.main
                          : alpha(theme.palette.divider, 0.1),
                      backgroundColor: (theme) =>
                        plan.popular
                          ? alpha(theme.palette.primary.main, 0.02)
                          : "background.paper",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: (theme) =>
                          `0 12px 24px ${alpha(
                            theme.palette.common.black,
                            0.1
                          )}`,
                      },
                    }}
                  >
                    {plan.popular && (
                      <Chip
                        label="RECOMMENDED"
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          height: 24,
                          fontSize: "0.75rem",
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                          border: "none",
                        }}
                      />
                    )}

                    <Box mb={3}>
                      <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "1.5rem", sm: "2rem" },
                        }}
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ minHeight: 40, opacity: 0.8 }}
                      >
                        {plan.description}
                      </Typography>
                      {plan.trialPeriod && (
                        <Chip
                          label={`${plan.trialPeriod.frequency} ${plan.trialPeriod.interval}${plan.trialPeriod.frequency > 1 ? "s" : ""} free trial`}
                          color="info"
                          size="small"
                          sx={{
                            mt: 1,
                            height: 24,
                            fontSize: "0.75rem",
                            bgcolor: (theme) =>
                              alpha(theme.palette.info.main, 0.1),
                            color: "info.main",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>

                    <Box mb={3}>
                      <Stack
                        direction="row"
                        alignItems="baseline"
                        spacing={1}
                        mb={1}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: "2rem", sm: "2.5rem" },
                            background: plan.popular
                              ? `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                              : "none",
                            WebkitBackgroundClip: plan.popular
                              ? "text"
                              : "none",
                            WebkitTextFillColor: plan.popular
                              ? "transparent"
                              : "inherit",
                          }}
                        >
                          {formatCurrency(
                            parseFloat(plan.unitPrice.amount) / 100,
                            plan.unitPrice.currencyCode
                          )}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          /{plan.interval}
                        </Typography>
                      </Stack>
                      {plan.interval === "year" && (
                        <Chip
                          label="Save 20%"
                          size="small"
                          color="success"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            bgcolor: (theme) =>
                              alpha(theme.palette.success.main, 0.1),
                            color: "success.main",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>

                    <Box flexGrow={1} mb={3}>
                      <List disablePadding>
                        {plan.features.map((feature) => (
                          <ListItem
                            key={feature}
                            disableGutters
                            sx={{
                              py: 0.75,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckIcon
                                fontSize="small"
                                sx={{
                                  color: plan.popular
                                    ? "primary.main"
                                    : "success.main",
                                  fontSize: "1rem",
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => handleSubscribe(plan)}
                      disabled={
                        !!processingAction ||
                        (hasActiveSubscription() &&
                          currentPlan?.priceId === plan.priceId)
                      }
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: 600,
                        ...(plan.popular && {
                          background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          boxShadow: `0 4px 8px ${alpha(
                            theme.palette.primary.main,
                            0.25
                          )}`,
                        }),
                      }}
                    >
                      {processingAction === plan.id ? (
                        <CircularProgress size={20} />
                      ) : hasActiveSubscription() &&
                        currentPlan?.priceId === plan.priceId ? (
                        "Current Plan"
                      ) : (
                        "Get Started"
                      )}
                    </Button>
                  </Paper>
                </Grid>
              )
          )}
        </Grid>
      </Box>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
          },
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            pb: 1,
            pt: 1,
            px: 2,
            typography: "h6",
            fontWeight: 700,
          }}
        >
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button
            onClick={() =>
              setConfirmDialog((prev) => ({ ...prev, open: false }))
            }
            variant="outlined"
            size="medium"
            sx={{ borderRadius: 2, px: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => confirmDialog.action()}
            color="primary"
            variant="contained"
            size="medium"
            autoFocus
            sx={{
              borderRadius: 2,
              px: 2,
              boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <div ref={checkoutContainerRef} />
    </Container>
  );
};

export default SubscriptionManager;
