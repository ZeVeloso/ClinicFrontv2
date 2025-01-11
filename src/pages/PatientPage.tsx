import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import GenericGrid from "../components/GenericGrid";
import { getPatient, updatePatient } from "../api/patients";
import {
  getAppointmentsByPatientId,
  createAppointment,
} from "../api/appointments";
import { formatDate, formatDateTime } from "../utils/dateHelper";
import { Patient } from "../types/Patient";
import { Appointment } from "../types/Appointment";

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<Patient>>({});

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

  const handleAddAppointment = async () => {
    try {
      const newAppointment = await createAppointment(id!);
      setAppointments((prev) => [...prev, newAppointment]);
    } catch (err) {
      setError("Failed to create appointment. Please try again.");
    }
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
        <Typography variant="h5" mb={2}>
          Patient Details
        </Typography>
        <TextField
          fullWidth
          label="Name"
          value={patient.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          onBlur={handleFieldBlur}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Birth Date"
          value={patient.birth}
          onChange={(e) => handleFieldChange("birth", e.target.value)}
          onBlur={handleFieldBlur}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Phone"
          value={patient.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          onBlur={handleFieldBlur}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Gender"
          value={patient.gender}
          onChange={(e) => handleFieldChange("gender", e.target.value)}
          onBlur={handleFieldBlur}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Address"
          value={patient.address}
          onChange={(e) => handleFieldChange("address", e.target.value)}
          onBlur={handleFieldBlur}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Job"
          value={patient.job}
          onChange={(e) => handleFieldChange("job", e.target.value)}
          onBlur={handleFieldBlur}
          sx={{ mb: 2 }}
        />
      </Card>

      <Card sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Appointments</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAppointment}
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
              motive: appt.motive,
              status: appt.status,
              obs: appt.obs,
            }))}
            columns={[
              { field: "name", headerName: "Patient", flex: 1, minWidth: 120 },
              { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
              { field: "motive", headerName: "Motive", flex: 1, minWidth: 150 },
              { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
            ]}
          />
        ) : (
          <Typography>No appointments found for this patient.</Typography>
        )}
      </Card>
    </Box>
  );
};

export default PatientDetailsPage;
