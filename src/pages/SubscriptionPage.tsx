import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { AccessTime as AccessTimeIcon } from "@mui/icons-material";
import { useSubscription } from "../features/subscription/hooks/useSubscription";
import SubscriptionManager from "../features/subscription/components/SubscriptionManager";
import { formatDate, formatCurrency } from "../utils/formatters";

const SubscriptionPage: React.FC = () => {
  const { currentSubscription, loading } = useSubscription();

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

  const getNextPaymentInfo = () => {
    if (
      !currentSubscription ||
      !currentSubscription.items?.[0]?.price?.unitPrice
    )
      return null;

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

  const paymentInfo = getNextPaymentInfo();

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

        {/* Subscription Manager Component */}
        <SubscriptionManager showTitle={false} />

        {/* Next Payment or End Date */}
        {currentSubscription &&
          currentSubscription.status === "active" &&
          paymentInfo && (
            <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AccessTimeIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {paymentInfo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(paymentInfo.amount, paymentInfo.currency)}{" "}
                    on {formatDate(paymentInfo.date)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}
      </Container>
    </Box>
  );
};

export default SubscriptionPage;
