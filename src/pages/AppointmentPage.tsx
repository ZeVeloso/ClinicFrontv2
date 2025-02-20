import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
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
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppointmentDetails } from "../features/appointments/hooks/useAppointmentDetails";
import { Appointment } from "../features/appointments/types";
import { useToast } from "../contexts/ToastContext";
import { useAppNavigation } from "../hooks/useAppNavigation";

type FormValues = {
  date: Dayjs | null;
  time: Dayjs | null;
  motive: string;
  obs: string;
  status: string;
  cost: number;
};

const statusColors = {
  N: "primary" as const,
  D: "success" as const,
  C: "error" as const,
};

const statusLabels = {
  N: "New",
  D: "Done",
  C: "Cancelled",
};

const AppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toAppointments } = useAppNavigation();
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
    toAppointments();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)", // Adjust based on your header height
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Container>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => toAppointments()}
            sx={{ mb: 2 }}
          >
            Back to Appointments
          </Button>
          <Stack direction="row" alignItems="center" spacing={2}>
            <EventIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1">
              {id ? "Edit Appointment" : "New Appointment"}
            </Typography>
          </Stack>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Patient Information Card */}
          {appointment?.patient && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <PersonIcon color="primary" />
                <Typography variant="h6">Patient Information</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Patient Name"
                    value={appointment.patient.name}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    value={appointment.patient.phone}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Appointment Form */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                {/* Date and Time Section */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Schedule Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="date"
                        control={control}
                        rules={{ required: "Appointment date is required" }}
                        render={({ field }) => (
                          <DatePicker
                            label="Date"
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
                            label="Time"
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
                  </Grid>
                </Grid>

                {/* Appointment Details Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Appointment Details
                  </Typography>
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
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <MenuItem key={key} value={key}>
                            <Chip
                              label={label}
                              size="small"
                              color={
                                statusColors[key as keyof typeof statusColors]
                              }
                              sx={{ mr: 1 }}
                            />
                          </MenuItem>
                        ))}
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
                        InputProps={{
                          inputProps: { min: 0, step: 0.01 },
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>€</Typography>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={() => toAppointments()}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                >
                  Save Appointment
                </Button>
              </Box>
            </Box>
          </Paper>
        </LocalizationProvider>
      </Container>
    </Box>
  );
};

export default AppointmentPage;
