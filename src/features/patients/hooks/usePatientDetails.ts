import { useState, useEffect, useCallback } from "react";
import { getPatient, updatePatient } from "../../../api/patients";
import {
  getAppointmentsByPatientId,
  updateAppointment,
  createAppointment,
} from "../../../api/appointments";
import { Patient } from "../types";
import { Appointment } from "../../appointments/types";
import { useToast } from "../../../contexts/ToastContext";

export const usePatientDetails = (patientId: string) => {
  // State for patient details
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState<boolean>(true);
  const [patientError, setPatientError] = useState<string | null>(null);

  // State for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );

  const [editedFields, setEditedFields] = useState<Partial<Patient>>({});
  const { showToast } = useToast();

  // Fetch only patient details
  const fetchPatient = useCallback(async () => {
    setLoadingPatient(true);
    setPatientError(null);
    try {
      const response = await getPatient(patientId);
      setPatient(response.data);
    } catch (err) {
      setPatientError("Failed to load patient details. Please try again.");
    } finally {
      setLoadingPatient(false);
    }
  }, [patientId]);

  // Fetch only appointments
  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    setAppointmentsError(null);
    try {
      const response = await getAppointmentsByPatientId(patientId);
      setAppointments(response);
    } catch (err) {
      setAppointmentsError("Failed to load appointments. Please try again.");
    } finally {
      setLoadingAppointments(false);
    }
  }, [patientId]);

  // On mount, load both in parallel
  useEffect(() => {
    fetchPatient();
    fetchAppointments();
  }, [fetchPatient, fetchAppointments]);

  const handleFieldChange = (field: keyof Patient, value: any) => {
    if (patient) {
      setPatient({ ...patient, [field]: value });
      setEditedFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  const savePatientChanges = async () => {
    if (Object.keys(editedFields).length > 0 && patient) {
      try {
        await updatePatient(patientId, { ...patient, ...editedFields });
        setEditedFields({});
        showToast("Patient updated successfully", "success");
        // Refresh only patient details
        //await fetchPatient();
      } catch (err) {
        showToast("Error updating patient", "error");
      }
    }
  };

  const addOrEditAppointment = async (appointmentData: any) => {
    try {
      if (appointmentData.id) {
        // Edit an existing appointment
        await updateAppointment(appointmentData.id, appointmentData);
        showToast("Appointment updated successfully", "success");
      } else {
        // Create a new appointment
        await createAppointment(patientId, appointmentData);
        showToast("Appointment created successfully", "success");
      }
      // Refresh only appointments
      await fetchAppointments();
    } catch (err) {
      showToast("Error saving appointment", "error");
    }
  };

  const toggleAppointmentStatus = async (appointmentId: string) => {
    try {
      // Optimistically update appointment status in state first
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: appt.status === "N" ? "C" : "N" }
            : appt
        )
      );
      const appointment = appointments.find(
        (appt) => appt.id === appointmentId
      );
      if (appointment) {
        const newStatus = appointment.status === "N" ? "C" : "N";
        await updateAppointment(appointmentId, {
          ...appointment,
          status: newStatus,
        });
        showToast("Appointment status updated successfully", "success");
      }
      // Refresh only appointments
      await fetchAppointments();
    } catch (err) {
      showToast("Error updating appointment status", "error");
    }
  };

  return {
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
    refreshPatient: fetchPatient,
    refreshAppointments: fetchAppointments,
  };
};
