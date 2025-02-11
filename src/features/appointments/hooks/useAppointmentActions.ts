import { useCallback } from "react";
import {
  createAppointment,
  updateAppointment,
} from "../../../api/appointments";
import { Appointment } from "../types";

export const useAppointmentActions = (
  appointments: Appointment[],
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const addAppointment = useCallback(
    async (appointmentData: any) => {
      try {
        const newAppointment = await createAppointment(
          appointmentData.patientId,
          appointmentData
        );
        // Update the local state by appending the new appointment
        setAppointments((prev) => [...prev, newAppointment]);
      } catch (err) {
        throw new Error("Error creating appointment. Please try again.");
      }
    },
    [setAppointments]
  );

  const editAppointment = useCallback(
    async (appointmentData: any) => {
      try {
        if (!appointmentData.id) {
          throw new Error("Appointment ID is required for editing.");
        }
        await updateAppointment(appointmentData.id, appointmentData);
        // Update the local state by merging the changes in the matching appointment
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentData.id
              ? { ...appt, ...appointmentData }
              : appt
          )
        );
      } catch (err) {
        throw new Error("Error updating appointment. Please try again.");
      }
    },
    [setAppointments]
  );

  const toggleAppointmentStatus = useCallback(
    async (appointmentId: string) => {
      try {
        const appointment = appointments.find(
          (appt) => appt.id === appointmentId
        );
        if (!appointment) {
          throw new Error("Appointment not found.");
        }
        const newStatus = appointment.status === "N" ? "D" : "N";
        await updateAppointment(appointmentId, {
          ...appointment,
          status: newStatus,
        });
        // Update the status in the in-memory list
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
      } catch (err) {
        throw new Error("Error toggling appointment status. Please try again.");
      }
    },
    [appointments, setAppointments]
  );

  const cancelAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const appointment = appointments.find(
          (appt) => appt.id === appointmentId
        );
        if (!appointment) {
          throw new Error("Appointment not found.");
        }
        await updateAppointment(appointmentId, { ...appointment, status: "C" });
        // Update the in-memory data to mark the appointment as cancelled
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: "C" } : appt
          )
        );
      } catch (err) {
        throw new Error("Error cancelling appointment. Please try again.");
      }
    },
    [appointments, setAppointments]
  );

  return {
    addAppointment,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
  };
};

export default useAppointmentActions;
