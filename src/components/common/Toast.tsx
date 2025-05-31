import React from "react";
import {
  Snackbar,
  Alert,
  AlertProps,
  SnackbarProps,
  Typography,
} from "@mui/material";

export type ToastSeverity = "success" | "info" | "warning" | "error";

interface ToastProps {
  open: boolean;
  autoHideDuration?: number;
  onClose: () => void;
  severity: ToastSeverity;
  message: string;
  variant?: AlertProps["variant"];
  anchorOrigin?: SnackbarProps["anchorOrigin"];
}

const Toast: React.FC<ToastProps> = ({
  open,
  autoHideDuration = 5000,
  onClose,
  severity,
  message,
  variant = "filled",
  anchorOrigin = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant={variant}
        elevation={6}
      >
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default Toast;
