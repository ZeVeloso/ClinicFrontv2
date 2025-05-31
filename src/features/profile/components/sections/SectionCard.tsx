import React, { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children }) => {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography variant="h6" fontWeight={500}>
            {title}
          </Typography>
        </Stack>
        <Box>{children}</Box>
      </Stack>
    </Paper>
  );
};

export default SectionCard;
