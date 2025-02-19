import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import {
  Container,
  Grid,
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppointmentDetails } from "../features/appointments/hooks/useAppointmentDetails";
import { Appointment } from "../features/appointments/types";
import { useToast } from "../contexts/ToastContext";

type FormValues = {
  date: Dayjs | null;
  time: Dayjs | null;
  motive: string;
  obs: string;
  status: string;
  cost: number;
};

const AppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appointment, loading, saveAppointment } = useAppointmentDetails(id);
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: null,
      time: null,
      motive: "",
      obs: "",
      status: "N",
      cost: 0,
    },
  });

  useEffect(() => {
    if (appointment) {
      const apptDate = dayjs(appointment.date);
      reset({
        date: apptDate,
        time: apptDate,
        motive: appointment.motive,
        obs: appointment.obs,
        status: appointment.status,
        cost: appointment.cost || 0,
      });
    }
  }, [appointment, reset]);

  const onSubmit = async (formData: FormValues) => {
    if (!formData.date || !formData.time) {
      showToast("Date and time are required", "error");
      return;
    }
    const combinedDateTime = formData.date
      .hour(formData.time.hour())
      .minute(formData.time.minute())
      .second(0)
      .toISOString();

    const payload: Appointment = {
      id: appointment?.id || "",
      date: combinedDateTime,
      motive: formData.motive,
      obs: formData.obs,
      status: formData.status,
      cost: formData.cost,
      patient: appointment?.patient || {
        id: "",
        name: "",
        phone: "",
        birth: "",
        gender: "",
        address: "",
        job: "",
      },
    };

    await saveAppointment(payload);
    navigate("/appointments");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      <Container sx={{ py: 4 }}>
        {appointment?.patient && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Patient Name"
                value={appointment.patient.name}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={appointment.patient.phone}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </Container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {id ? "Edit Appointment" : "Create Appointment"}
          </Typography>
          {appointment?.patient && (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Patient Name"
                  value={appointment.patient.name}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={appointment.patient.phone}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Appointment date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      label="Appointment Date"
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: "Appointment time is required" }}
                  render={({ field }) => (
                    <TimePicker
                      label="Appointment Time"
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.time,
                          helperText: errors.time?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="motive"
                  control={control}
                  rules={{ required: "Motive is required" }}
                  render={({ field }) => (
                    <TextField
                      label="Motive"
                      fullWidth
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.motive}
                      helperText={errors.motive?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="obs"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Observations"
                      fullWidth
                      multiline
                      minRows={3}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Status"
                      select
                      fullWidth
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <MenuItem value="N">New</MenuItem>
                      <MenuItem value="D">Done</MenuItem>
                      <MenuItem value="C">Cancelled</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Cost (€)"
                      type="number"
                      fullWidth
                      value={field.value}
                      onChange={field.onChange}
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
                <Button variant="contained" type="submit">
                  Save Appointment
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </LocalizationProvider>
    </Box>
  );
};

export default AppointmentPage;
