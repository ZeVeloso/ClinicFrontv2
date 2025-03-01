import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  MenuItem,
  DialogActions,
  Grid as MuiGrid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelIcon from "@mui/icons-material/Cancel";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { usePatientDetails } from "../features/patients/hooks/usePatientDetails";
import GenericGrid from "../components/common/GenericGrid";
import AppointmentForm from "../features/appointments/components/AppointmentForm";
import { formatDateTime } from "../utils/dateHelper";
import { useAppNavigation } from "../hooks/useAppNavigation";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toPatients } = useAppNavigation();
  const {
    patient,
    appointments,
    loadingPatient,
    loadingAppointments,
    patientError,
    appointmentsError,
    actionLoading,
    handleFieldChange,
    savePatientChanges,
    addOrEditAppointment,
    handleStatusAction,
  } = usePatientDetails(id!);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    appointmentId: string | null;
    action: "cancel" | "complete" | null;
  }>({ open: false, appointmentId: null, action: null });

  if (loadingPatient) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (patientError || !patient) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6" color="error">
          {patientError || "Patient not found."}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => toPatients()}
          sx={{ mt: 2 }}
        >
          Back to Patients
        </Button>
      </Box>
    );
  }

  const statusChipColor: Record<string, "success" | "info" | "error"> = {
    D: "success",
    N: "info",
    C: "error",
  } as const;

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => toPatients()} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4">{patient.name}</Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentAppointment(null);
            setIsFormOpen(true);
          }}
        >
          New Appointment
        </Button>
      </Stack>

      {/* Main Content */}
      <MuiGrid container spacing={3}>
        {/* Left Column - Patient Information */}
        <MuiGrid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Personal Information Card */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ContactMailIcon color="primary" />
                  <Typography variant="h6">Personal Information</Typography>
                </Stack>
                <TextField
                  fullWidth
                  label="Name"
                  value={patient.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={savePatientChanges}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={patient.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={savePatientChanges}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Birth Date"
                  type="date"
                  value={patient.birth}
                  onChange={(e) => handleFieldChange("birth", e.target.value)}
                  onBlur={savePatientChanges}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Gender"
                  select
                  value={patient.gender}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                  onBlur={savePatientChanges}
                  size="small"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Address"
                  value={patient.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  onBlur={savePatientChanges}
                  size="small"
                  multiline
                  rows={2}
                />
              </Stack>
            </Paper>

            {/* Medical History Summary */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MedicalInformationIcon color="primary" />
                  <Typography variant="h6">Medical Summary</Typography>
                </Stack>
                <TextField
                  fullWidth
                  label="Personal Medical History"
                  multiline
                  rows={3}
                  value={patient.personalHistory || ""}
                  onChange={(e) =>
                    handleFieldChange("personalHistory", e.target.value)
                  }
                  onBlur={savePatientChanges}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Physical Activity"
                  multiline
                  rows={2}
                  value={patient.physicalActivity || ""}
                  onChange={(e) =>
                    handleFieldChange("physicalActivity", e.target.value)
                  }
                  onBlur={savePatientChanges}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Family History"
                  multiline
                  rows={3}
                  value={patient.familyHistory || ""}
                  onChange={(e) =>
                    handleFieldChange("familyHistory", e.target.value)
                  }
                  onBlur={savePatientChanges}
                  size="small"
                />
              </Stack>
            </Paper>
          </Stack>
        </MuiGrid>

        {/* Right Column - Appointments */}
        <MuiGrid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
            <Stack spacing={3} sx={{ height: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ScheduleIcon color="primary" />
                <Typography variant="h6">Appointment History</Typography>
              </Stack>

              {loadingAppointments ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : appointmentsError ? (
                <Typography variant="body1" color="error">
                  {appointmentsError}
                </Typography>
              ) : appointments.length > 0 ? (
                <Box sx={{ flexGrow: 1 }}>
                  <GenericGrid
                    rows={appointments.map((appt) => ({
                      id: appt.id,
                      date: formatDateTime(new Date(appt.date)),
                      status: appt.status,
                      motive: appt.motive,
                      obs: appt.obs,
                    }))}
                    columns={[
                      {
                        field: "date",
                        headerName: "Date",
                        flex: 1,
                        minWidth: 180,
                      },
                      {
                        field: "status",
                        headerName: "Status",
                        flex: 0.5,
                        minWidth: 120,
                        renderCell: ({ row }) => (
                          <Chip
                            label={
                              row.status === "D"
                                ? "Done"
                                : row.status === "N"
                                  ? "Scheduled"
                                  : "Cancelled"
                            }
                            color={
                              statusChipColor[
                                row.status as keyof typeof statusChipColor
                              ]
                            }
                            size="small"
                          />
                        ),
                      },
                      {
                        field: "motive",
                        headerName: "Reason",
                        flex: 1.5,
                        minWidth: 200,
                      },
                      {
                        field: "actions",
                        headerName: "Actions",
                        flex: 0.5,
                        minWidth: 150,
                        renderCell: ({ row }) => (
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setCurrentAppointment(row);
                                  setIsFormOpen(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark as Done">
                              <span>
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      appointmentId: row.id,
                                      action: "complete",
                                    })
                                  }
                                  disabled={
                                    row.status === "C" ||
                                    row.status === "D" ||
                                    actionLoading[row.id]
                                  }
                                >
                                  {actionLoading[row.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <CheckIcon />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      appointmentId: row.id,
                                      action: "cancel",
                                    })
                                  }
                                  disabled={
                                    row.status === "C" || actionLoading[row.id]
                                  }
                                >
                                  {actionLoading[row.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <CancelIcon />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        ),
                      },
                    ]}
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Typography color="textSecondary">
                    No appointments found for this patient.
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </MuiGrid>
      </MuiGrid>

      {/* Dialogs */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, appointmentId: null, action: null })
        }
      >
        <DialogTitle>
          {confirmDialog.action === "cancel"
            ? "Cancel Appointment"
            : "Complete Appointment"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {confirmDialog.action === "cancel" ? "cancel" : "mark as complete"}{" "}
            this appointment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                appointmentId: null,
                action: null,
              })
            }
            color="inherit"
          >
            No, Keep it
          </Button>
          <Button
            onClick={() =>
              confirmDialog.appointmentId &&
              handleStatusAction(
                confirmDialog.appointmentId,
                confirmDialog.action!,
                () =>
                  setConfirmDialog({
                    open: false,
                    appointmentId: null,
                    action: null,
                  })
              )
            }
            color={confirmDialog.action === "cancel" ? "error" : "success"}
            variant="contained"
            autoFocus
          >
            Yes, {confirmDialog.action === "cancel" ? "Cancel" : "Complete"} it
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ScheduleIcon color="primary" />
            <Typography variant="h6">
              {currentAppointment ? "Edit Appointment" : "New Appointment"}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <AppointmentForm
            initialValues={currentAppointment || {}}
            onSubmit={async (values) => {
              await addOrEditAppointment(values);
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientDetailsPage;
