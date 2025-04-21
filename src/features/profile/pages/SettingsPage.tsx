import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { useToast } from "@contexts/ToastContext";

interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    try {
      await onSubmit(oldPassword, newPassword);
      onClose();
    } catch (err) {
      setError("Failed to update password");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LockIcon color="primary" />
          <Typography variant="h6">Change Password</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            type="password"
            label="Current Password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            type="password"
            label="New Password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            type="password"
            label="Confirm New Password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [settings, setSettings] = useState({
    name: "Dr. John Doe",
    phone: "+1 234 567 890",
    language: "en",
    currency: "EUR",
  });

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
  ];

  const currencies = [
    { value: "EUR", label: "Euro (€)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "GBP", label: "British Pound (£)" },
  ];

  const handleSettingChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    showToast("Settings updated successfully", "success");
  };

  const handlePasswordChange = async () => {
    // Implement password change logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast("Password updated successfully", "success");
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {/* Personal Information */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonIcon color="primary" />
              <span>Personal Information</span>
            </Stack>
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Name"
              value={settings.name}
              onChange={(e) => handleSettingChange("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={settings.phone}
              onChange={(e) => handleSettingChange("phone", e.target.value)}
              fullWidth
            />
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setPasswordDialog(true)}
            >
              Change Password
            </Button>
          </Stack>
        </Paper>

        {/* Preferences */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LanguageIcon color="primary" />
              <span>Preferences</span>
            </Stack>
          </Typography>
          <Stack spacing={3}>
            <TextField
              select
              label="Language"
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              fullWidth
            >
              {languages.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Currency"
              value={settings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
              fullWidth
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>
      </Stack>

      <PasswordDialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        onSubmit={handlePasswordChange}
      />
    </Box>
  );
};

export default SettingsPage;
