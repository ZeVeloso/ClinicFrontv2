import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowUpward as UpgradeIcon,
  ArrowDownward as DowngradeIcon,
  Receipt as ReceiptIcon,
  AccessTime as AccessTimeIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useSubscription, Plan } from "../contexts/SubscriptionContext";
import { formatDate, formatCurrency } from "../utils/formatters";
import { useToast } from "../contexts/ToastContext";
const SubscriptionPage: React.FC = () => {
  const theme = useTheme();
  const {
    plans,
    currentSubscription,
    subscriptionHistory,
    loading,
    createCheckout,
    cancelSubscription,
    updateSubscription,
  } = useSubscription();

  const { showToast } = useToast();

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

  // Find current plan details
  const currentPlan = currentSubscription
    ? plans.find((plan) => plan.id === currentSubscription.planId)
    : null;

  const handleSubscribe = async (plan: Plan) => {
    try {
      setProcessingAction(plan.id);
      console.log(
        `Initiating checkout for plan: ${plan.name} (${plan.priceId})`
      );

      await createCheckout(plan.priceId);

      console.log("Checkout process initiated successfully");
      // The checkout is now handled by Paddle.js in the context
    } catch (error) {
      console.error("Error during checkout process:", error);
      showToast("Failed to create checkout. Please try again later.", "error");
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
        "Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.",
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

  const handleChangePlan = (plan: Plan) => {
    if (!currentSubscription) return;

    const isUpgrade = plan.price > (currentPlan?.price || 0);

    setConfirmDialog({
      open: true,
      title: isUpgrade ? "Upgrade Plan" : "Change Plan",
      message: `Are you sure you want to ${isUpgrade ? "upgrade" : "change"} to the ${plan.name} plan? ${
        isUpgrade
          ? "You will be charged the difference immediately."
          : "Changes will take effect at the end of your current billing period."
      }`,
      action: async () => {
        setProcessingAction(plan.id);
        try {
          await updateSubscription(currentSubscription.id, plan.priceId);
        } finally {
          setProcessingAction(null);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f5f7fb",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Subscription Management
          </Typography>
          <Typography color="text.secondary">
            Manage your subscription plan and billing information
          </Typography>
        </Box>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6">Active Subscription</Typography>
                </Stack>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  You are currently on the <strong>{currentPlan?.name}</strong>{" "}
                  plan.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentSubscription.cancelAtPeriodEnd
                    ? `Your subscription will end on ${formatDate(currentSubscription.currentPeriodEnd)}.`
                    : `Your next billing date is ${formatDate(currentSubscription.currentPeriodEnd)}.`}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                {!currentSubscription.cancelAtPeriodEnd && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelSubscription}
                    disabled={!!processingAction}
                  >
                    {processingAction === "cancel" ? (
                      <CircularProgress size={24} color="error" />
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const element =
                      document.getElementById("subscription-plans");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Manage Plan
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Subscription Plans */}
        <Box id="subscription-plans" sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {currentSubscription ? "Available Plans" : "Choose a Plan"}
          </Typography>

          <Grid container spacing={3}>
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id;

              return (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      borderRadius: 2,
                      ...(plan.popular && {
                        borderTop: `4px solid ${theme.palette.primary.main}`,
                      }),
                      ...(isCurrentPlan && {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                        borderStyle: "solid",
                      }),
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    {plan.popular && (
                      <Chip
                        label="Most Popular"
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontWeight: 500,
                        }}
                      />
                    )}

                    <CardHeader
                      title={plan.name}
                      subheader={plan.description}
                      titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                      subheaderTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      sx={{ pb: 0 }}
                    />

                    <CardContent sx={{ pt: 2, pb: 2, flexGrow: 1 }}>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ mb: 1, fontWeight: 700 }}
                      >
                        {formatCurrency(plan.price, plan.currency)}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          /{plan.interval}
                        </Typography>
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <List dense disablePadding>
                        {plan.features.map((feature, index) => (
                          <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      {isCurrentPlan ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          disabled
                          sx={{ borderRadius: 2 }}
                        >
                          Current Plan
                        </Button>
                      ) : currentSubscription ? (
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={
                            plan.price > (currentPlan?.price || 0) ? (
                              <UpgradeIcon />
                            ) : (
                              <DowngradeIcon />
                            )
                          }
                          onClick={() => handleChangePlan(plan)}
                          disabled={!!processingAction}
                          sx={{ borderRadius: 2 }}
                        >
                          {processingAction === plan.id ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : plan.price > (currentPlan?.price || 0) ? (
                            "Upgrade"
                          ) : (
                            "Switch"
                          )}
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubscribe(plan)}
                          disabled={!!processingAction}
                          sx={{ borderRadius: 2 }}
                        >
                          {processingAction === plan.id ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Subscribe"
                          )}
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Billing History */}
        {currentSubscription && subscriptionHistory.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Billing History
            </Typography>

            <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Box sx={{ minWidth: 600 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(150px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)",
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      p: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Date
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Amount
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Status
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Invoice
                    </Typography>
                  </Box>

                  {subscriptionHistory.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(150px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)",
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {formatDate(item.date)}
                        </Typography>
                      </Box>

                      <Typography variant="body2">
                        {formatCurrency(item.amount, item.currency)}
                      </Typography>

                      <Box>
                        <Chip
                          size="small"
                          label={item.status}
                          color={
                            item.status === "completed"
                              ? "success"
                              : item.status === "refunded"
                                ? "warning"
                                : "error"
                          }
                        />
                      </Box>

                      <Button
                        startIcon={<ReceiptIcon />}
                        size="small"
                        variant="text"
                        onClick={() => {
                          // Handle invoice download or view
                          console.log("View invoice for", item.id);
                        }}
                      >
                        Invoice
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Next Payment */}
        {currentSubscription &&
          currentSubscription.nextPayment &&
          !currentSubscription.cancelAtPeriodEnd && (
            <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AccessTimeIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Next Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(
                      currentSubscription.nextPayment.amount,
                      currentSubscription.nextPayment.currency
                    )}{" "}
                    on {formatDate(currentSubscription.nextPayment.date)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog((prev) => ({ ...prev, open: false }))
            }
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action}
            variant="contained"
            color={confirmDialog.title.includes("Cancel") ? "error" : "primary"}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPage;
