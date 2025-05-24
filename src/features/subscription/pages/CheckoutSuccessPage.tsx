import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useSubscription } from "../hooks/useSubscription";
import { APP_PATHS } from "@config/navigationConfig";

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSubscriptionData, currentSubscription, loading } =
    useSubscription();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshSubscriptionData();
      } catch (error) {
        console.error("Error refreshing subscription data:", error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }, []);

  // Redirect to subscription page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(APP_PATHS.SETTINGS);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading || refreshing) {
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
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            border: "1px solid #e0e7ff",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />

            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Payment Successful!
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              Thank you for your subscription. Your account has been
              successfully updated.
              {currentSubscription && (
                <Box component="span" display="block" mt={1}>
                  Your subscription is now active and will renew on
                </Box>
              )}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You will be redirected to the subscription page in a few
                seconds...
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(APP_PATHS.SETTINGS)}
                sx={{ px: 4 }}
              >
                Go to Subscription
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CheckoutSuccessPage;
