import React from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface LoadingStateProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorFallback?: React.ReactNode;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  loadingMessage = "Loading...",
  errorFallback,
  fullPage = false,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
          height: fullPage ? "calc(100vh - 200px)" : "auto",
          width: "100%",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {loadingMessage}
        </Typography>
      </Box>
    );
  }

  if (error) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }

    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" align="center">
          {error.message || "An unexpected error occurred"}
        </Typography>
      </Paper>
    );
  }

  return <>{children}</>;
};

export default LoadingState;
