import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  alpha,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Language as LanguageIcon,
  CurrencyExchange as CurrencyIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

interface PreferencesSectionProps {
  settings: {
    language: string;
    currency: string;
  };
  onSettingChange: (field: string, value: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  settings,
  onSettingChange,
  onSave,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 3,
        }}
      >
        Account Preferences
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Customize how your account works to best suit your needs
      </Typography>

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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="language-label">Language</InputLabel>
              <Select
                labelId="language-label"
                value={settings.language}
                onChange={(e) => onSettingChange("language", e.target.value)}
                disabled={isLoading}
                label="Language"
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  },
                }}
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: 1, ml: 1 }}>
                    <LanguageIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="en">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 16,
                        bgcolor: "#1976d2",
                        borderRadius: 0.5,
                      }}
                    ></Box>
                    English
                  </Box>
                </MenuItem>
                <MenuItem value="es">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 16,
                        bgcolor: "#f44336",
                        borderRadius: 0.5,
                      }}
                    ></Box>
                    Español
                  </Box>
                </MenuItem>
                <MenuItem value="fr">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 16,
                        bgcolor: "#2196f3",
                        borderRadius: 0.5,
                      }}
                    ></Box>
                    Français
                  </Box>
                </MenuItem>
                <MenuItem value="pt">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 16,
                        bgcolor: "#4caf50",
                        borderRadius: 0.5,
                      }}
                    ></Box>
                    Português
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                value={settings.currency}
                onChange={(e) => onSettingChange("currency", e.target.value)}
                disabled={isLoading}
                label="Currency"
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  },
                }}
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: 1, ml: 1 }}>
                    <CurrencyIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="USD">US Dollar ($)</MenuItem>
                <MenuItem value="EUR">Euro (€)</MenuItem>
                <MenuItem value="GBP">British Pound (£)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={onSave}
            disabled={isLoading}
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
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.8)})`,
            }}
          >
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PreferencesSection;
