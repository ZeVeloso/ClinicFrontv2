import React, { useState } from "react";
import { TextField, Box, Button, Grid, Typography } from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface AppointmentFormProps {
  initialValues?: {
    date?: string;
    motive?: string;
    obs?: string;
  };
  onSubmit: (values: { date: string; motive: string; obs: string }) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState({
    date: initialValues.date ? dayjs(initialValues.date) : null,
    time: initialValues.date ? dayjs(initialValues.date) : null,
    motive: initialValues.motive || "",
    obs: initialValues.obs || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate: Dayjs | null) =>
    setFormValues((prev) => ({ ...prev, date: newDate }));

  const handleTimeChange = (newTime: Dayjs | null) =>
    setFormValues((prev) => ({ ...prev, time: newTime }));

  const handleSubmit = () => {
    if (formValues.date && formValues.time) {
      const dateTime = formValues.date
        .hour(formValues.time.hour())
        .minute(formValues.time.minute())
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ss[Z]");

      onSubmit({
        date: dateTime,
        motive: formValues.motive.trim(),
        obs: formValues.obs.trim(),
      });
    }
  };

  const isFormValid = formValues.date && formValues.time && formValues.motive;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6" textAlign="center">
          Schedule Appointment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DatePicker
              label="Date"
              value={formValues.date}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="Time"
              value={formValues.time}
              onChange={handleTimeChange}
              ampm={false}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
        <TextField
          label="Motive"
          name="motive"
          value={formValues.motive}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Observations"
          name="obs"
          value={formValues.obs}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isFormValid}
          >
            Save
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentForm;
