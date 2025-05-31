import React from "react";
import { Box, BoxProps } from "@mui/material";

interface ActionButtonsProps extends BoxProps {
  children: React.ReactNode;
  alignment?: "left" | "right" | "center" | "space-between";
  spacing?: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  children,
  alignment = "right",
  spacing = 2,
  ...rest
}) => {
  const justifyContent =
    alignment === "left"
      ? "flex-start"
      : alignment === "right"
        ? "flex-end"
        : alignment === "center"
          ? "center"
          : "space-between";

  // Converting React children to array to apply spacing
  const childrenArray = React.Children.toArray(children);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent,
        alignItems: "center",
        mt: 3,
        ...rest.sx,
      }}
      {...rest}
    >
      {childrenArray.map((child, index) => (
        <Box key={index} sx={{ ml: index > 0 ? spacing : 0 }}>
          {child}
        </Box>
      ))}
    </Box>
  );
};

export default ActionButtons;
