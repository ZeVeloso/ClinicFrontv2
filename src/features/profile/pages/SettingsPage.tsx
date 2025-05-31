import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Container,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Person as PersonIcon,
  Palette as PaletteIcon,
  Support as SupportIcon,
} from "@mui/icons-material";
import { useToast } from "@contexts/ToastContext";
import {
  updatePassword,
  deleteAccount,
  contactSupport,
  updateUserProfile,
} from "@api/auth";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PUBLIC_PATHS } from "@config/navigationConfig";

// Import modular components
import PasswordDialog from "../components/dialogs/PasswordDialog";
import DeleteAccountDialog from "../components/dialogs/DeleteAccountDialog";
import ContactSupportDialog from "../components/dialogs/ContactSupportDialog";
import PersonalInfoSection from "../components/sections/PersonalInfoSection";
import PreferencesSection from "../components/sections/PreferencesSection";
import NotificationsSection from "../components/sections/NotificationsSection";
import SupportAccountSection from "../components/sections/SupportAccountSection";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`,
  };
}

// Enhanced Settings Page
const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();
  const { user, logout, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [contactSupportDialog, setContactSupportDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    name: "",
    phone: "",
    email: "",
    language: "en",
    currency: "EUR",
    notifications: {
      email: true,
      sms: false,
      app: true,
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleSettingChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    console.log("user", user);
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, {
        name: settings.name,
        //phone: settings.phone,
      });
      await refreshUserData();
      showToast("Profile updated successfully", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (channel: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: value,
      },
    }));
    showToast(
      `${channel} notifications ${value ? "enabled" : "disabled"}`,
      "success"
    );
  };

  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      await updatePassword(oldPassword, newPassword);
      showToast("Password updated successfully", "success");
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteAccount = async (password: string) => {
    if (!user) return;

    try {
      await deleteAccount(password, user.id);
      showToast("Account deleted successfully", "success");
      logout();
      navigate(PUBLIC_PATHS.LOGIN);
    } catch (error) {
      throw error;
    }
  };

  const handleContactSupport = async (data: {
    subject: string;
    message: string;
    category: string;
  }) => {
    try {
      await contactSupport(data);
      showToast("Your message has been sent to our support team", "success");
    } catch (error) {
      throw error;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
        pb: 6,
      }}
    >
      {/* Header Section with Background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
          pt: 6,
          pb: { xs: 6, md: 10 },
          position: "relative",
          mb: { xs: -4, md: -6 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.05)",
            transform: "skewY(-5deg)",
            transformOrigin: "top right",
          },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={3}
          >
            <Avatar
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                backgroundColor: alpha(theme.palette.common.white, 0.9),
                color: theme.palette.primary.main,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.15)}`,
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Account Settings
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  opacity: 0.9,
                  maxWidth: "600px",
                }}
              >
                Manage your profile, preferences, and account settings
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.1)}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              minHeight: "500px",
            }}
          >
            {/* Side Tab Navigation */}
            <Box
              sx={{
                width: { xs: "100%", md: "220px" },
                backgroundColor: theme.palette.background.paper,
                borderRight: {
                  xs: "none",
                  md: `1px solid ${theme.palette.divider}`,
                },
                borderBottom: {
                  xs: `1px solid ${theme.palette.divider}`,
                  md: "none",
                },
              }}
            >
              <Tabs
                orientation={isMobile ? "horizontal" : "vertical"}
                variant={isMobile ? "fullWidth" : "standard"}
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Settings tabs"
                sx={{
                  ".MuiTabs-indicator": {
                    left: isMobile ? undefined : 0,
                    width: isMobile ? undefined : "4px",
                    borderRadius: "0 4px 4px 0",
                  },
                  ".MuiTab-root": {
                    alignItems: "flex-start",
                    textAlign: "left",
                    py: 2.5,
                    px: 3,
                    minHeight: isMobile ? "48px" : "60px",
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      backgroundColor: isMobile
                        ? "transparent"
                        : alpha(theme.palette.primary.main, 0.05),
                    },
                  },
                }}
              >
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label="Personal Info"
                  {...a11yProps(0)}
                  sx={{
                    justifyContent: isMobile ? "center" : "flex-start",
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                />
                <Tab
                  icon={<PaletteIcon />}
                  iconPosition="start"
                  label="Preferences"
                  {...a11yProps(1)}
                  sx={{
                    justifyContent: isMobile ? "center" : "flex-start",
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                />
                {/*<Tab
                  icon={<NotificationsIcon />}
                  iconPosition="start"
                  label="Notifications"
                  {...a11yProps(2)}
                  sx={{
                    justifyContent: isMobile ? "center" : "flex-start",
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                />*/}
                <Tab
                  icon={<SupportIcon />}
                  iconPosition="start"
                  label="Support & Account"
                  {...a11yProps(3)}
                  sx={{
                    justifyContent: isMobile ? "center" : "flex-start",
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
              <TabPanel value={tabValue} index={0}>
                <PersonalInfoSection
                  settings={settings}
                  onSettingChange={handleSettingChange}
                  onOpenPasswordDialog={() => setPasswordDialog(true)}
                  onSave={handleSaveProfile}
                  isLoading={isLoading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <PreferencesSection
                  settings={settings}
                  onSettingChange={handleSettingChange}
                  onSave={handleSaveProfile}
                  isLoading={isLoading}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <NotificationsSection
                  notifications={settings.notifications}
                  onNotificationChange={handleNotificationChange}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <SupportAccountSection
                  onOpenContactDialog={() => setContactSupportDialog(true)}
                  onOpenDeleteDialog={() => setDeleteAccountDialog(true)}
                />
              </TabPanel>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Dialogs */}
      <PasswordDialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        onSubmit={handlePasswordChange}
      />

      <DeleteAccountDialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
      />

      <ContactSupportDialog
        open={contactSupportDialog}
        onClose={() => setContactSupportDialog(false)}
        onSubmit={handleContactSupport}
      />
    </Box>
  );
};

export default SettingsPage;
