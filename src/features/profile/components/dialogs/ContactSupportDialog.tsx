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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextareaAutosize,
  styled,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  SupportAgent as SupportIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
} from "@mui/icons-material";

interface ContactSupportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subject: string;
    message: string;
    category: string;
  }) => Promise<void>;
}

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-family: ${theme.typography.fontFamily};
  font-size: 1rem;
  line-height: 1.5;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.divider};
  background-color: ${theme.palette.background.paper};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    border-color: ${alpha(theme.palette.primary.main, 0.7)};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.palette.primary.main};
    box-shadow: 0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)};
  }
  
  &::placeholder {
    color: ${theme.palette.text.secondary};
    opacity: 0.7;
  }
`
);

const ContactSupportDialog: React.FC<ContactSupportDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportCategories = [
    { value: "general", label: "General Inquiry", icon: "❓" },
    { value: "billing", label: "Billing & Subscription", icon: "💳" },
    { value: "technical", label: "Technical Issue", icon: "🔧" },
    { value: "feature", label: "Feature Request", icon: "💡" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const handleSubmit = async () => {
    if (!subject || !message) {
      setError("Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ subject, message, category });
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setCategory("general");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = supportCategories.find(
      (cat) => cat.value === categoryValue
    );
    return category?.icon || "❓";
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
          backgroundColor: alpha(theme.palette.primary.light, 0.05),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SupportIcon color="primary" />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Contact Support
          </Typography>
        </Stack>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.light, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Our support team is here to help you. Please fill out the form
              below with details about your issue, and we'll get back to you as
              soon as possible.
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

          <FormControl fullWidth variant="outlined">
            <InputLabel id="support-category-label">Category</InputLabel>
            <Select
              labelId="support-category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.divider, 0.8),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              {supportCategories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">{option.icon}</Typography>
                    <Typography>{option.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Subject"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <Box
                  component="span"
                  sx={{ mr: 1, color: alpha(theme.palette.text.primary, 0.5) }}
                >
                  {getCategoryIcon(category)}
                </Box>
              ),
            }}
          />

          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              color="text.secondary"
              fontWeight={500}
            >
              Message *
            </Typography>
            <StyledTextarea
              minRows={8}
              placeholder="Please describe your issue or question in detail... The more information you provide, the better we can help you."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {message.length} characters •{" "}
              {message.length > 0 ? Math.ceil(message.length / 5) : 0} words
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              startIcon={<AttachIcon />}
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
            >
              Attach Files
            </Button>

            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                label="Screenshot"
                variant="outlined"
                onDelete={() => {}}
                sx={{ borderRadius: 1 }}
              />
              <Chip
                size="small"
                label="Error Log"
                variant="outlined"
                onDelete={() => {}}
                sx={{ borderRadius: 1 }}
              />
            </Stack>
          </Box>
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
          onClick={handleSubmit}
          disabled={isSubmitting || !subject || !message}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
            "&:hover": {
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
            },
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.8)})`,
          }}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactSupportDialog;
