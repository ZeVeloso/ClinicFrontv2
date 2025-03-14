import { useCallback } from "react";
import {
  createAppointment,
  createAppointment2,
  updateAppointment,
} from "../../../api/appointments";
import { Appointment } from "../types";
//import { useNavigate } from "react-router-dom";
export const useAppointmentActions = (
  appointments: Appointment[],
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  //const navigate = useNavigate();

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

  const addAppointment2 = useCallback(
    async (appointmentData: any) => {
      try {
        const newAppointment = await createAppointment2(appointmentData);
        // Update the local state by appending the new appointment
        setAppointments((prev) => [...prev, newAppointment]);
      } catch (err) {
        throw new Error("Error creating appointment. Please try again.");
      }
    },
    [setAppointments]
  );

  const editAppointment = (appointmentData: any) => {
    updateAppointment(appointmentData.id, appointmentData);
    //navigate(`/appointments/${appointmentData.id}`);
  };

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
    addAppointment2,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
  };
};

export default useAppointmentActions;
