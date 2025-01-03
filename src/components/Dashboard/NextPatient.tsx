import React, { useEffect, useState } from "react";
import { fetchNextPatient } from "../../api/patients";
import { Typography, Box } from "@mui/material";

const NextPatient: React.FC = () => {
  const [nextPatient, setNextPatient] = useState<{
    id: string;
    name: string;
    details: string;
  } | null>(null);

  useEffect(() => {
    fetchNextPatient().then(setNextPatient);
  }, []);

  if (!nextPatient) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h6">Next Patient</Typography>
      <Typography variant="body1">
        <strong>{nextPatient.name}</strong>
      </Typography>
      <Typography variant="body2">{nextPatient.details}</Typography>
    </Box>
  );
};

export default NextPatient;
