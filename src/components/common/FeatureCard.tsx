import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        transition: "all 0.3s ease-in-out",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          transform: onClick ? "translateY(-10px)" : "none",
          boxShadow: onClick ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: "center", py: 4 }}>
        <Box
          sx={{
            mb: 3,
            color: "primary.main",
            transform: "scale(1.5)",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography color="textSecondary">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
