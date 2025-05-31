import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "start",
  ...rest
}) => {
  const startIcon = iconPosition === "start" ? icon : undefined;
  const endIcon = iconPosition === "end" ? icon : undefined;

  return (
    <MuiButton
      variant="contained"
      disabled={disabled || loading}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      {...rest}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;
