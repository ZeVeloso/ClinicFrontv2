import React, { useEffect, useState } from "react";
import { fetchMonthlyEarnings } from "../../api/management";
import { Typography, Box } from "@mui/material";

const MonthlyEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<number>(0);

  useEffect(() => {
    fetchMonthlyEarnings().then(setEarnings);
  }, []);

  return (
    <Box>
      <Typography variant="h6">Monthly Earnings</Typography>
      <Typography variant="h4">${earnings.toFixed(2)}</Typography>
    </Box>
  );
};

export default MonthlyEarnings;
