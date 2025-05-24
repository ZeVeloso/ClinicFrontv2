import React from "react";
import { Box, Typography, Divider } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  divider?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  divider = true,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: subtitle ? 1 : divider ? 3 : 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom={!!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: divider ? 3 : 4 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      {divider && <Divider sx={{ mb: 4 }} />}
    </>
  );
};

export default PageHeader;
