import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  IconButton,
  Box,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";
import { useSubscription } from "@features/subscription/hooks/useSubscription";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { hasActiveSubscription } = useSubscription();

  const handleSubmit = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (!confirmDelete) {
      setError("Please confirm that you understand the consequences");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(password);
      // If successful, user will be logged out and redirected
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPassword("");
    setError("");
    setConfirmDelete(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: alpha(theme.palette.error.light, 0.05),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteIcon color="error" />
          </Box>
          <Typography variant="h6" fontWeight={600} color="error.main">
            Delete Account
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert
            severity="warning"
            variant="filled"
            icon={<WarningIcon />}
            sx={{
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.warning.main, 0.9),
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              This action cannot be undone
            </Typography>
          </Alert>

          <Box
            sx={{
              p: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Typography variant="body2" paragraph>
              Deleting your account will immediately:
            </Typography>

            <Stack spacing={1} sx={{ ml: 2, mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.error.main,
                    display: "inline-block",
                  }}
                />
                Permanently remove all your personal information
              </Typography>

              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.error.main,
                    display: "inline-block",
                  }}
                />
                Delete all your medical records and appointment history
              </Typography>

              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.error.main,
                    display: "inline-block",
                  }}
                />
                Remove you from any scheduled appointments
              </Typography>

              {hasActiveSubscription() && (
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.error.main,
                      display: "inline-block",
                    }}
                  />
                  Cancel your active subscription automatically
                </Typography>
              )}
            </Stack>

            <Typography variant="body2" fontWeight={500} color="error.main">
              This process cannot be reverted. All your data will be permanently
              lost.
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: theme.palette.error.main,
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              To confirm deletion, please enter your password:
            </Typography>

            <TextField
              type={showPassword ? "text" : "password"}
              label="Your Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: theme.palette.error.main,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                sx={{
                  color: theme.palette.error.main,
                  "&.Mui-checked": {
                    color: theme.palette.error.main,
                  },
                }}
              />
            }
            label={
              <Typography variant="body2">
                I understand that this action cannot be undone and all my data
                will be permanently deleted
              </Typography>
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            textTransform: "none",
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={isSubmitting || !password || !confirmDelete}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.25)}`,
            "&:hover": {
              boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.35)}`,
            },
          }}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
        >
          {isSubmitting ? "Processing..." : "Delete My Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
