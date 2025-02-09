import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Grid, Typography } from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface AppointmentFormValues {
  id?: string;
  date: Dayjs | null;
  time: Dayjs | null;
  motive: string;
  obs: string;
}

interface AppointmentFormProps {
  initialValues?: {
    id?: string;
    date?: string;
    motive?: string;
    obs?: string;
  };
  onSubmit: (values: {
    id?: string;
    date: string;
    motive: string;
    obs: string;
    status: string;
  }) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  // Parse the initial datetime if available
  const initialDateTime = initialValues.date
    ? dayjs(initialValues.date, "DD/MM/YYYY HH:mm")
    : null;

  // Set default values and include the id if present
  const defaultValues: AppointmentFormValues = {
    id: initialValues.id,
    date: initialDateTime ? initialDateTime.startOf("day") : null,
    time: initialDateTime,
    motive: initialValues.motive || "",
    obs: initialValues.obs || "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormValues>({ defaultValues });

  const onFormSubmit = (data: AppointmentFormValues) => {
    if (data.date && data.time) {
      // Combine the date (with a zeroed time) with the selected time values
      const combinedDateTime = data.date
        .hour(data.time.hour())
        .minute(data.time.minute())
        .second(0)
        .millisecond(0);
      onSubmit({
        id: data.id, // pass the id if it exists
        date: combinedDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        motive: data.motive.trim(),
        obs: data.obs.trim(),
        status: "N",
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" textAlign="center">
            {defaultValues.id ? "Edit Appointment" : "Schedule Appointment"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    label="Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="time"
                control={control}
                rules={{ required: "Time is required" }}
                render={({ field }) => (
                  <TimePicker
                    label="Time"
                    value={field.value}
                    onChange={field.onChange}
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.time,
                        helperText: errors.time?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Controller
            name="motive"
            control={control}
            rules={{ required: "Motive is required" }}
            render={({ field }) => (
              <TextField
                label="Motive"
                fullWidth
                required
                {...field}
                error={!!errors.motive}
                helperText={errors.motive?.message}
              />
            )}
          />
          <Controller
            name="obs"
            control={control}
            render={({ field }) => (
              <TextField
                label="Observations"
                fullWidth
                multiline
                rows={3}
                {...field}
              />
            )}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={onCancel} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default AppointmentForm;
