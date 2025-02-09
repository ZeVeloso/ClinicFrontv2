import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import GenericGrid from "../components/common/GenericGrid";
import AppointmentForm from "../features/appointments/components/AppointmentForm";
import { formatDateTime } from "../utils/dateHelper";
import { usePatientDetails } from "../features/patients/hooks/usePatientDetails";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleIcon from "@mui/icons-material/Schedule";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    patient,
    appointments,
    loadingPatient,
    loadingAppointments,
    patientError,
    appointmentsError,
    handleFieldChange,
    savePatientChanges,
    addOrEditAppointment,
    toggleAppointmentStatus,
  } = usePatientDetails(id!);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);

  if (loadingPatient)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (patientError)
    return (
      <Typography variant="body1" color="error" textAlign="center">
        {patientError}
      </Typography>
    );
  if (!patient)
    return (
      <Typography variant="body1" textAlign="center">
        Patient not found.
      </Typography>
    );

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Patient {patient.name}</Typography>
      </Box>
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Name"
              value={patient.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Phone"
              value={patient.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Job"
              value={patient.job}
              onChange={(e) => handleFieldChange("job", e.target.value)}
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              value={patient.birth}
              onChange={(e) => handleFieldChange("birth", e.target.value)}
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Address"
              value={patient.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Gender"
              value={patient.gender}
              onChange={(e) => handleFieldChange("gender", e.target.value)}
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Personal History"
              value={patient.personalHistory || ""}
              onChange={(e) =>
                handleFieldChange("personalHistory", e.target.value)
              }
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
              rows={3}
              multiline
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Pyshical Activity"
              value={patient.physicalActivity || ""}
              onChange={(e) =>
                handleFieldChange("physicalActivity", e.target.value)
              }
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
              rows={3}
              multiline
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Family History"
              value={patient.familyHistory || ""}
              onChange={(e) =>
                handleFieldChange("familyHistory", e.target.value)
              }
              onBlur={savePatientChanges}
              sx={{ mb: 2 }}
              rows={3}
              multiline
            />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Appointments</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentAppointment(null);
              setIsFormOpen(true);
            }}
          >
            Add Appointment
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
              name: patient.name, // since you're on a patient detail page
              status: appt.status,
              motive: appt.motive,
              obs: appt.obs,
            }))}
            columns={[
              { field: "name", headerName: "Patient", flex: 1, minWidth: 120 },
              { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
              {
                field: "status",
                headerName: "Status",
                flex: 0.2,
                minWidth: 50,
                renderCell: ({ row }: { row: { status: string } }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {row.status === "C" ? (
                      <CheckIcon color="success" />
                    ) : row.status === "N" ? (
                      <ScheduleIcon color="info" />
                    ) : null}
                  </Box>
                ),
              },
              { field: "motive", headerName: "Motive", flex: 1, minWidth: 150 },
              {
                field: "actions",
                headerName: "Actions",
                flex: 1,
                minWidth: 250,
                renderCell: ({ row }: { row: any }) => (
                  <>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setCurrentAppointment(row);
                        setIsFormOpen(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="text"
                      color="success"
                      size="small"
                      onClick={() => toggleAppointmentStatus(row.id)}
                    >
                      <CheckIcon />
                    </Button>
                  </>
                ),
              },
            ]}
          />
        ) : (
          <Typography>No appointments found for this patient.</Typography>
        )}
      </Card>
      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <DialogTitle>
          {currentAppointment ? "Edit Appointment" : "Schedule Appointment"}
        </DialogTitle>
        <DialogContent>
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
