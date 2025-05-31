import React from "react";
import {
  Paper,
  Typography,
  Box,
  PaperProps,
  Divider,
  useTheme,
} from "@mui/material";

interface CardProps extends Omit<PaperProps, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
  noBodyPadding?: boolean;
  headerBorder?: boolean;
  fullHeight?: boolean;
  minHeight?: number | string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  action,
  noPadding = false,
  noBodyPadding = false,
  headerBorder = true,
  fullHeight = false,
  minHeight,
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const hasHeader = title || subtitle || icon || action;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: fullHeight ? "100%" : "auto",
        minHeight: minHeight,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...sx,
      }}
      {...rest}
    >
      {hasHeader && (
        <>
          <Box
            sx={{
              px: noPadding ? 0 : 3,
              py: noPadding ? 0 : 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {icon && <Box sx={{ mr: 2, display: "flex" }}>{icon}</Box>}
              <Box>
                {title && (
                  <Typography variant="h6" component="div">
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            {action && <Box>{action}</Box>}
          </Box>
          {headerBorder && <Divider />}
        </>
      )}
      <Box
        sx={{
          p: noPadding || noBodyPadding ? 0 : 3,
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default Card;
