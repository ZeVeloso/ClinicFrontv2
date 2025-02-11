import { useState, useEffect, useCallback } from "react";
import { getPatient, updatePatient } from "../../../api/patients";
import { getAppointmentsByPatientId } from "../../../api/appointments";
import { Patient } from "../types";
import { Appointment } from "../../appointments/types";
import { useToast } from "../../../contexts/ToastContext";
import { useAppointmentActions } from "../../appointments/hooks/useAppointmentActions";

export const usePatientDetails = (patientId: string) => {
  // Patient state
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState<boolean>(true);
  const [patientError, setPatientError] = useState<string | null>(null);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );

  // Used to update patient fields before saving changes
  const [editedFields, setEditedFields] = useState<Partial<Patient>>({});

  const { showToast } = useToast();

  // Fetch patient details
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

  // Fetch appointments for the patient
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

  useEffect(() => {
    fetchPatient();
    fetchAppointments();
  }, [fetchPatient, fetchAppointments]);

  // Update patient fields as the user edits them
  const handleFieldChange = (field: keyof Patient, value: any) => {
    if (patient) {
      setPatient({ ...patient, [field]: value });
      setEditedFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Save the updated patient details
  const savePatientChanges = async () => {
    if (patient && Object.keys(editedFields).length > 0) {
      try {
        await updatePatient(patientId, { ...patient, ...editedFields });
        setEditedFields({});
        showToast("Patient updated successfully", "success");
      } catch (err) {
        showToast("Error updating patient", "error");
      }
    }
  };

  // Use the shared appointment actions with in-memory updates
  const {
    addAppointment,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
  } = useAppointmentActions(appointments, setAppointments);

  const addOrEditAppointment = async (appointmentData: any) => {
    try {
      if (appointmentData.id) {
        await editAppointment(appointmentData);
        showToast("Appointment updated successfully", "success");
      } else {
        const newAppointmentData = { ...appointmentData, patientId };
        await addAppointment(newAppointmentData);
        showToast("Appointment created successfully", "success");
      }
    } catch (err) {
      showToast("Error saving appointment", "error");
    }
  };

  const handleToggleAppointmentStatus = async (appointmentId: string) => {
    try {
      await toggleAppointmentStatus(appointmentId);
      showToast("Appointment status updated successfully", "success");
    } catch (err) {
      showToast("Error updating appointment status", "error");
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      showToast("Appointment cancelled successfully", "success");
    } catch (err) {
      showToast("Error cancelling appointment", "error");
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
    toggleAppointmentStatus: handleToggleAppointmentStatus,
    cancelAppointment: handleCancelAppointment,
    refreshPatient: fetchPatient,
    refreshAppointments: fetchAppointments,
  };
};

export default usePatientDetails;
