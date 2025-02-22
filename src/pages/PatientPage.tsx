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
  Tab,
  Tabs,
  MenuItem,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import { usePatientDetails } from "../features/patients/hooks/usePatientDetails";
import GenericGrid from "../components/common/GenericGrid";
import AppointmentForm from "../features/appointments/components/AppointmentForm";
import { formatDateTime } from "../utils/dateHelper";
import { useAppNavigation } from "../hooks/useAppNavigation";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toPatients } = useAppNavigation();
  const [activeTab, setActiveTab] = useState(0);
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

  if (loadingPatient)
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
    <Box
      sx={{
        padding: { xs: 1, sm: 2, md: 3 }, // Responsive padding
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        {" "}
        {/* Responsive margin */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => toPatients()}
          sx={{ mb: { xs: 1, sm: 2 } }} // Responsive margin
        >
          Back to Patients
        </Button>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1, sm: 2 }} // Responsive spacing
          sx={{ flexWrap: "wrap" }} // Allow wrapping on small screens
        >
          <PersonIcon
            color="primary"
            sx={{ fontSize: { xs: 30, sm: 35, md: 40 } }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Responsive font
            }}
          >
            {patient.name}
          </Typography>
        </Stack>
      </Box>

      {/* Main Content */}
      <Paper
        elevation={1}
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          overflow: "hidden", // Prevent content overflow
          width: "100%",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-flexContainer": {
              flexWrap: { xs: "wrap", sm: "nowrap" }, // Stack tabs on mobile
            },
          }}
        >
          <Tab
            icon={<ContactMailIcon />}
            label="Personal Info"
            sx={{
              minWidth: { xs: "100%", sm: "auto" }, // Full width on mobile
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          />
          <Tab
            icon={<MedicalInformationIcon />}
            label="Medical History"
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          />
          <Tab
            icon={<ScheduleIcon />}
            label="Appointments"
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          />
        </Tabs>

        {/* Tab Content */}
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
            overflowX: "auto", // Allow horizontal scroll if needed
          }}
        >
          {/* Personal Information Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={patient.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={savePatientChanges}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={patient.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onBlur={savePatientChanges}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Birth Date"
                    type="date"
                    value={patient.birth}
                    onChange={(e) => handleFieldChange("birth", e.target.value)}
                    onBlur={savePatientChanges}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={patient.address}
                    onChange={(e) =>
                      handleFieldChange("address", e.target.value)
                    }
                    onBlur={savePatientChanges}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Gender"
                    select
                    value={patient.gender}
                    onChange={(e) =>
                      handleFieldChange("gender", e.target.value)
                    }
                    onBlur={savePatientChanges}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Medical History Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <MedicalInformationIcon color="primary" />
                    <Typography variant="h6">
                      Personal Medical History
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={patient.personalHistory || ""}
                    onChange={(e) =>
                      handleFieldChange("personalHistory", e.target.value)
                    }
                    onBlur={savePatientChanges}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <FitnessCenterIcon color="primary" />
                    <Typography variant="h6">Physical Activity</Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={patient.physicalActivity || ""}
                    onChange={(e) =>
                      handleFieldChange("physicalActivity", e.target.value)
                    }
                    onBlur={savePatientChanges}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <FamilyRestroomIcon color="primary" />
                    <Typography variant="h6">Family History</Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={patient.familyHistory || ""}
                    onChange={(e) =>
                      handleFieldChange("familyHistory", e.target.value)
                    }
                    onBlur={savePatientChanges}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Appointments Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography variant="h6">Appointment History</Typography>
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
              </Box>

              {loadingAppointments ? (
                <CircularProgress />
              ) : appointmentsError ? (
                <Typography variant="body1" color="error">
                  {appointmentsError}
                </Typography>
              ) : appointments.length > 0 ? (
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
                      headerName: "Motive",
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
              ) : (
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="textSecondary">
                    No appointments found for this patient.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCurrentAppointment(null);
                      setIsFormOpen(true);
                    }}
                    sx={{ mt: 2 }}
                  >
                    Schedule First Appointment
                  </Button>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </Paper>
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
      {/* Appointment Dialog */}
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
