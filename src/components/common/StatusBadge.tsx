import React from "react";
import { Badge, BadgeProps } from "@mui/material";

type StatusType = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  variant?: BadgeProps["variant"];
}

const getColorByStatus = (status: StatusType): string => {
  switch (status) {
    case "success":
      return "#4caf50";
    case "warning":
      return "#ff9800";
    case "error":
      return "#f44336";
    case "info":
      return "#2196f3";
    default:
      return "#757575";
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  variant = "standard",
}) => {
  return (
    <Badge
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: getColorByStatus(status),
          color: "white",
          fontWeight: "bold",
          minWidth: "80px",
          padding: "4px 8px",
          borderRadius: "12px",
        },
      }}
      badgeContent={label}
      variant={variant}
    />
  );
};

export default StatusBadge;
