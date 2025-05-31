import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
  alpha,
  InputAdornment,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

interface PersonalInfoSectionProps {
  settings: {
    name: string;
    email: string;
    phone: string;
  };
  onSettingChange: (field: string, value: string) => void;
  onOpenPasswordDialog: () => void;
  onSave: () => Promise<void>;
  isLoading?: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  settings,
  onSettingChange,
  onOpenPasswordDialog,
  onSave,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(settings);

  useEffect(() => {
    // Check if current settings differ from original settings
    const changed =
      originalSettings.name !== settings.name ||
      originalSettings.phone !== settings.phone;
    setHasChanges(changed);
  }, [settings, originalSettings]);

  useEffect(() => {
    // Update original settings when they first load or are saved
    if (!isLoading) {
      setOriginalSettings({ ...settings });
    }
  }, [isLoading]);

  const handleSettingChange = (field: string, value: string) => {
    onSettingChange(field, value);
  };

  const handleSave = async () => {
    await onSave();
    setHasChanges(false);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 3,
        }}
      >
        Personal Information
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Update your personal information and how we can reach you
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              background: alpha(theme.palette.background.paper, 0.8),
              "&:hover": {
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
              },
              transition: "box-shadow 0.3s ease-in-out",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.8),
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                {settings.name ? settings.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {settings.name || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {settings.email || "No email provided"}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  value={settings.name}
                  onChange={(e) => handleSettingChange("name", e.target.value)}
                  fullWidth
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address"
                  value={settings.email}
                  onChange={(e) => handleSettingChange("email", e.target.value)}
                  fullWidth
                  type="email"
                  disabled={true} // Email is usually not changeable
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: alpha(
                        theme.palette.action.disabledBackground,
                        0.05
                      ),
                    },
                  }}
                  helperText="Email address cannot be changed"
                />
              </Grid>
              {/* Uncomment if phone number is needed
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange("phone", e.target.value)}
                  fullWidth
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Grid>*/}
            </Grid>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                startIcon={<SecurityIcon />}
                onClick={onOpenPasswordDialog}
                disabled={isLoading}
                color="secondary"
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Change Password
              </Button>

              <Button
                variant="contained"
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                color="primary"
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoSection;
