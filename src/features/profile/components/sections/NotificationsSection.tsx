import React from "react";
import {
  Stack,
  Switch,
  FormControlLabel,
  FormGroup,
  Typography,
  Box,
  useTheme,
  alpha,
  Paper,
  Grid,
  Divider,
  Card,
  Chip,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  AppSettingsAlt as AppIcon,
  Info as InfoIcon,
  NotificationsActive as ActiveIcon,
  NotificationsOff as OffIcon,
} from "@mui/icons-material";

interface NotificationsSectionProps {
  notifications: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
  onNotificationChange: (channel: string, value: boolean) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  onNotificationChange,
}) => {
  const theme = useTheme();

  const getActiveCount = () => {
    return Object.values(notifications).filter(Boolean).length;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
          }}
        >
          Notifications
        </Typography>

        <Chip
          icon={
            getActiveCount() > 0 ? (
              <ActiveIcon fontSize="small" />
            ) : (
              <OffIcon fontSize="small" />
            )
          }
          label={`${getActiveCount()} active`}
          color={getActiveCount() > 0 ? "primary" : "default"}
          variant={getActiveCount() > 0 ? "filled" : "outlined"}
          size="small"
          sx={{
            fontWeight: 500,
            borderRadius: 1.5,
            px: 0.5,
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Control how you receive notifications and updates about appointments,
        reminders, and system alerts
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.03)}`,
          "&:hover": {
            boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.07)}`,
          },
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 3,
            backgroundColor: alpha(theme.palette.primary.light, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Communication Channels
          </Typography>
        </Box>

        <FormGroup>
          <Stack>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2.5,
                px: 3,
                transition: "background-color 0.2s ease",
                backgroundColor: notifications.email
                  ? alpha(theme.palette.primary.light, 0.05)
                  : "transparent",
                position: "relative",
                "&:hover": {
                  backgroundColor: notifications.email
                    ? alpha(theme.palette.primary.light, 0.08)
                    : alpha(theme.palette.background.default, 0.7),
                },
                "&::after": notifications.email
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "60%",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "0 4px 4px 0",
                    }
                  : {},
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    backgroundColor: notifications.email
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.grey[500], 0.08),
                    color: notifications.email
                      ? theme.palette.primary.main
                      : theme.palette.grey[600],
                    mr: 2,
                    transition: "all 0.2s ease",
                  }}
                >
                  <EmailIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive appointment confirmations, reminders, and updates
                    via email
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {notifications.email && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      borderRadius: 1,
                      height: 24,
                    }}
                  />
                )}
                <Switch
                  checked={notifications.email}
                  onChange={(e) =>
                    onNotificationChange("email", e.target.checked)
                  }
                  name="email"
                  color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                        "& + .MuiSwitch-track": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.5
                          ),
                          opacity: 0.7,
                        },
                      },
                    },
                    "& .MuiSwitch-thumb": {
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    },
                    "& .MuiSwitch-track": {
                      borderRadius: 22 / 2,
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mx: 3 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2.5,
                px: 3,
                transition: "background-color 0.2s ease",
                backgroundColor: notifications.sms
                  ? alpha(theme.palette.primary.light, 0.05)
                  : "transparent",
                position: "relative",
                "&:hover": {
                  backgroundColor: notifications.sms
                    ? alpha(theme.palette.primary.light, 0.08)
                    : alpha(theme.palette.background.default, 0.7),
                },
                "&::after": notifications.sms
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "60%",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "0 4px 4px 0",
                    }
                  : {},
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    backgroundColor: notifications.sms
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.grey[500], 0.08),
                    color: notifications.sms
                      ? theme.palette.primary.main
                      : theme.palette.grey[600],
                    mr: 2,
                    transition: "all 0.2s ease",
                  }}
                >
                  <SmsIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1" fontWeight={500}>
                      SMS Notifications
                    </Typography>
                    <Tooltip
                      title="Standard SMS rates may apply depending on your carrier"
                      arrow
                    >
                      <InfoIcon
                        sx={{
                          fontSize: 16,
                          color: theme.palette.text.secondary,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Receive urgent alerts and appointment reminders via text
                    message
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {notifications.sms && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      borderRadius: 1,
                      height: 24,
                    }}
                  />
                )}
                <Switch
                  checked={notifications.sms}
                  onChange={(e) =>
                    onNotificationChange("sms", e.target.checked)
                  }
                  name="sms"
                  color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                        "& + .MuiSwitch-track": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.5
                          ),
                          opacity: 0.7,
                        },
                      },
                    },
                    "& .MuiSwitch-thumb": {
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    },
                    "& .MuiSwitch-track": {
                      borderRadius: 22 / 2,
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mx: 3 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2.5,
                px: 3,
                transition: "background-color 0.2s ease",
                backgroundColor: notifications.app
                  ? alpha(theme.palette.primary.light, 0.05)
                  : "transparent",
                position: "relative",
                "&:hover": {
                  backgroundColor: notifications.app
                    ? alpha(theme.palette.primary.light, 0.08)
                    : alpha(theme.palette.background.default, 0.7),
                },
                "&::after": notifications.app
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "60%",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "0 4px 4px 0",
                    }
                  : {},
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    backgroundColor: notifications.app
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.grey[500], 0.08),
                    color: notifications.app
                      ? theme.palette.primary.main
                      : theme.palette.grey[600],
                    mr: 2,
                    transition: "all 0.2s ease",
                  }}
                >
                  <AppIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    In-App Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive real-time alerts and updates within the application
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {notifications.app && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      borderRadius: 1,
                      height: 24,
                    }}
                  />
                )}
                <Switch
                  checked={notifications.app}
                  onChange={(e) =>
                    onNotificationChange("app", e.target.checked)
                  }
                  name="app"
                  color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                        "& + .MuiSwitch-track": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.5
                          ),
                          opacity: 0.7,
                        },
                      },
                    },
                    "& .MuiSwitch-thumb": {
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    },
                    "& .MuiSwitch-track": {
                      borderRadius: 22 / 2,
                    },
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </FormGroup>
      </Paper>

      <Box
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.info.main, 0.4)}`,
          backgroundColor: alpha(theme.palette.info.light, 0.05),
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <InfoIcon color="info" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="body2">
              <strong>Note:</strong> You can further customize notification
              types for each channel in the{" "}
              <strong>Notification Preferences</strong> section of your specific
              features.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default NotificationsSection;
