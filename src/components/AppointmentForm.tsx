import React, { useState } from "react";
import { TextField, Box, Button, Grid } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

type AppointmentFormProps = {
  initialValues?: {
    date: string;
    motive: string;
    obs: string;
  };
  onSubmit: (values: {
    date: string;
    motive: string;
    obs: string;
  }) => void;
  onCancel: () => void;
};

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState({
    date: initialValues?.date ? dayjs(initialValues.date) : null,
    motive: initialValues?.motive || "",
    obs: initialValues?.obs || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    setFormValues((prev) => ({
      ...prev,
      date: newValue,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formValues,
      date: formValues.date ? formValues.date.toISOString() : "",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <DateTimePicker
              label="Date & Time"
              value={formValues.date}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Motive"
              name="motive"
              variant="outlined"
              fullWidth
              value={formValues.motive}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Observations"
              name="obs"
              variant="outlined"
              fullWidth
              value={formValues.obs}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentForm;
