import React from "react";
import { Box, Typography, Paper, Divider, SxProps, Theme } from "@mui/material";

interface FormSectionProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  sx,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        ...sx,
      }}
    >
      {(title || icon) && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {icon && (
              <Box
                sx={{
                  mr: 2,
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icon}
              </Box>
            )}
            <Box>
              {title && (
                <Typography variant="h6" fontWeight="medium">
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
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      {children}
    </Paper>
  );
};

export default FormSection;
