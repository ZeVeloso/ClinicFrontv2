import React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps as MuiDialogProps,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DialogProps extends MuiDialogProps {
  title?: string;
  actions?: React.ReactNode;
  onClose: () => void;
  maxWidth?: MuiDialogProps["maxWidth"];
  fullWidth?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  children,
  actions,
  onClose,
  maxWidth = "sm",
  fullWidth = true,
  ...rest
}) => {
  return (
    <MuiDialog
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...rest}
    >
      {title && (
        <DialogTitle sx={{ m: 0, p: 2, pb: 0 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      <DialogContent sx={{ px: 3, py: 2 }}>{children}</DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
