import React from "react";
import {
  Stack,
  Button,
  Typography,
  Box,
  useTheme,
  alpha,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  Support as SupportIcon,
  DeleteForever as DeleteIcon,
  HelpOutline as HelpIcon,
  SupportAgent as AgentIcon,
  ContentPaste as DocumentIcon,
  Forum as ForumIcon,
} from "@mui/icons-material";

interface SupportAccountSectionProps {
  onOpenContactDialog: () => void;
  onOpenDeleteDialog: () => void;
}

const SupportAccountSection: React.FC<SupportAccountSectionProps> = ({
  onOpenContactDialog,
  onOpenDeleteDialog,
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
        Support & Account
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Get help or manage your account settings
      </Typography>

      {/* Support Options */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          background: alpha(theme.palette.background.paper, 0.8),
          mb: 4,
          "&:hover": {
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
          },
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Help & Support
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <AgentIcon
                color="primary"
                sx={{
                  fontSize: 40,
                  mb: 1,
                  p: 1,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                Contact Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get help from our team
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenContactDialog}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <DocumentIcon
                color="primary"
                sx={{
                  fontSize: 40,
                  mb: 1,
                  p: 1,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                Documentation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Browse help articles
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                  },
                }}
                component="a"
                href="#"
                target="_blank"
              >
                View Docs
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <ForumIcon
                color="primary"
                sx={{
                  fontSize: 40,
                  mb: 1,
                  p: 1,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                Community
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Join our community
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                  },
                }}
                component="a"
                href="#"
                target="_blank"
              >
                Join Forum
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Account Management */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
          backgroundColor: alpha(theme.palette.error.light, 0.02),
          "&:hover": {
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
          },
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} color="error">
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Permanently delete your account and all your data
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onOpenDeleteDialog}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              borderWidth: "1.5px",
              "&:hover": {
                borderWidth: "1.5px",
                bgcolor: alpha(theme.palette.error.main, 0.04),
              },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SupportAccountSection;
