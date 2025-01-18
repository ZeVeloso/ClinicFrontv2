import React, { useState, useEffect, useCallback } from "react";
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
import {
  Delete as DeleteIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import GenericGrid from "../components/GenericGrid";
import { getPatient, updatePatient } from "../api/patients";
import {
  getAppointmentsByPatientId,
  createAppointment,
  updateAppointment,
} from "../api/appointments";
import { formatDateTime } from "../utils/dateHelper";
import { Patient } from "../types/Patient";
import { Appointment } from "../types/Appointment";
import AppointmentForm from "../components/AppointmentForm";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<Patient>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const patientData = await getPatient(id!);
      const appointmentData = await getAppointmentsByPatientId(id!);
      setPatient(patientData.data);
      setAppointments(appointmentData);
    } catch (err) {
      setError("Failed to load patient details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleFieldChange = (field: keyof Patient, value: any) => {
    if (patient) {
      setPatient({ ...patient, [field]: value });
      setEditedFields({ ...editedFields, [field]: value });
    }
  };

  const handleFieldBlur = async () => {
    if (Object.keys(editedFields).length > 0 && patient) {
      try {
        await updatePatient(id!, { ...patient, ...editedFields });
        setEditedFields({});
      } catch (err) {
        setError("Failed to save changes. Please try again.");
      }
    }
  };

  const handleAddAppointmentClick = () => {
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointmentId: string) => {
    const appointment = appointments.find((appt) => appt.id === appointmentId);
    if (appointment) {
      setCurrentAppointment(appointment); // Edit mode
      setIsFormOpen(true);
    }
  };

  const handleCheckAppointment = async (appointmentId: string) => {
    try {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: appt.status === "N" ? "C" : "N" }
            : appt
        )
      );

      const appointment = appointments.find(
        (appt) => appt.id === appointmentId
      );

      if (appointment) {
        const { patient, ...appointmentPayload } = appointment;

        await updateAppointment(appointmentId, {
          ...appointmentPayload,
          status: appointment.status === "N" ? "C" : "N",
        });
      }
    } catch (error) {
      setError("Failed to update appointment status. Please try again.");
    }
  };

  const handleFormSubmit = async (values: {
    date: string;
    motive: string;
    obs: string;
    status: string;
  }) => {
    try {
      if (currentAppointment) {
        // Editing existing appointment
        await updateAppointment(currentAppointment.id, {
          ...values,
          id: currentAppointment.id,
        });
        setCurrentAppointment(null);
      } else {
        // Creating new appointment
        const newAppointment = await createAppointment(id!, values);
        setAppointments((prev) => [...prev, newAppointment]);
      }
      setIsFormOpen(false);
    } catch (err) {
      setError("Failed to save appointment. Please try again.");
    }
  };

  const handleFormCancel = () => {
    setCurrentAppointment(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  if (!patient) {
    return (
      <Typography variant="body1" textAlign="center">
        Patient not found.
      </Typography>
    );
  }

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
              onBlur={handleFieldBlur}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Phone"
              value={patient.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              onBlur={handleFieldBlur}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Job"
              value={patient.job}
              onChange={(e) => handleFieldChange("job", e.target.value)}
              onBlur={handleFieldBlur}
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
              onBlur={handleFieldBlur}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Address"
              value={patient.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              onBlur={handleFieldBlur}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Gender"
              value={patient.gender}
              onChange={(e) => handleFieldChange("gender", e.target.value)}
              onBlur={handleFieldBlur}
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
              onBlur={handleFieldBlur}
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
              onBlur={handleFieldBlur}
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
              onBlur={handleFieldBlur}
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
            onClick={handleAddAppointmentClick}
          >
            Add Appointment
          </Button>
        </Box>
        {appointments.length > 0 ? (
          <GenericGrid
            rows={appointments.map((appt) => ({
              id: appt.id,
              date: formatDateTime(new Date(appt.date)),
              name: appt.patient?.name,
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
                renderCell: ({ row }: { row: Appointment }) => (
                  <>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => handleEditAppointment(row.id)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="text"
                      color="success"
                      size="small"
                      onClick={() => handleCheckAppointment(row.id)}
                    >
                      <CheckIcon />
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      //  onClick={() => handleDeleteAppointment(row.id)}
                    >
                      <DeleteIcon />
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
      <Dialog open={isFormOpen} onClose={handleFormCancel}>
        <DialogTitle>
          {currentAppointment ? "Edit Appointment" : "Schedule Appointment"}
        </DialogTitle>
        <DialogContent>
          <AppointmentForm
            initialValues={currentAppointment || {}}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientDetailsPage;
