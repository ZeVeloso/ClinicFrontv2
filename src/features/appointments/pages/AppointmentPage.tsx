import React, { useEffect, useState } from "react";
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
  IconButton,
  Tooltip,
  Divider,
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
import EditIcon from "@mui/icons-material/Edit";
import EuroIcon from "@mui/icons-material/Euro";
import { useAppointmentDetails } from "@features/appointments/hooks/useAppointmentDetails";
import { Appointment } from "@features/appointments/types";
import { useToast } from "@contexts/ToastContext";
import { useAppNavigation } from "@hooks/useAppNavigation";
import PatientSelector from "@features/patients/components/PatientSelector";
import { Patient } from "@features/patients/types";

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
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);

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
      if (appointment.patient) {
        setSelectedPatient(appointment.patient);
      }
    }
  }, [appointment, reset]);

  const onSubmit = async (formData: FormValues) => {
    if (!formData.date || !formData.time) {
      showToast("Date and time are required", "error");
      return;
    }

    if (!selectedPatient && !appointment?.patient) {
      showToast("Please select a patient", "error");
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
      cost: Number(formData.cost),
      patient: selectedPatient || appointment?.patient,
    };

    await saveAppointment(payload);
    //toAppointments();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={() => toAppointments()}
                color="primary"
                sx={{ p: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" component="h1">
                {id ? "Edit Appointment" : "New Appointment"}
              </Typography>
            </Stack>
            <Chip
              icon={<EventIcon />}
              label={dayjs().format("MMMM D, YYYY")}
              color="primary"
              variant="outlined"
            />
          </Stack>

          {/* Main Content */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                {/* Patient Information */}
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    <PersonIcon color="primary" />
                    <Typography variant="h6">Patient Information</Typography>
                    {(selectedPatient || appointment?.patient) &&
                      !isEditingPatient && (
                        <Tooltip title="Change Patient">
                          <IconButton
                            size="small"
                            onClick={() => setIsEditingPatient(true)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                  </Stack>
                  {(selectedPatient || appointment?.patient) &&
                  !isEditingPatient ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Name"
                          value={
                            (selectedPatient || appointment?.patient)?.name
                          }
                          InputProps={{ readOnly: true }}
                          fullWidth
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone"
                          value={
                            (selectedPatient || appointment?.patient)?.phone
                          }
                          InputProps={{ readOnly: true }}
                          fullWidth
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <PatientSelector
                      selectedPatient={selectedPatient}
                      onPatientSelect={(patient) => {
                        setSelectedPatient(patient);
                        setIsEditingPatient(false);
                      }}
                    />
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Date and Time */}
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Date"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.date,
                            helperText: errors.date?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <TimePicker
                        label="Time"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.time,
                            helperText: errors.time?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Status"
                        select
                        fullWidth
                        size="small"
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
                            />
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Fee"
                        type="number"
                        fullWidth
                        size="small"
                        value={field.value}
                        onChange={field.onChange}
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mr: 1,
                                color: "text.secondary",
                              }}
                            >
                              <EuroIcon fontSize="small" />
                            </Box>
                          ),
                          inputProps: { min: 0, step: 0.01 },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Clinical Information */}
                <Grid item xs={12}>
                  <Controller
                    name="motive"
                    control={control}
                    rules={{ required: "Reason is required" }}
                    render={({ field }) => (
                      <TextField
                        label="Reason for Visit"
                        fullWidth
                        size="small"
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
                        label="Clinical Notes"
                        fullWidth
                        multiline
                        minRows={4}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Observations, diagnosis, treatment plan..."
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => toAppointments()}
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentPage;
