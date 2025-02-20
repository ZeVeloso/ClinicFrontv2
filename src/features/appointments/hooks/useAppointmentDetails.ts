import { useState, useEffect, useCallback } from "react";
import { getAppointment, updateAppointment } from "../../../api/appointments";
import { Appointment } from "../types";
import { useToast } from "../../../contexts/ToastContext";

export const useAppointmentDetails = (appointmentId?: string) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(!!appointmentId);
  const { showToast } = useToast();

  const fetchAppointment = useCallback(async () => {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const data = await getAppointment(appointmentId);
      setAppointment(data);
    } catch {
      showToast("Error loading appointment", "error");
    } finally {
      setLoading(false);
    }
  }, [appointmentId, showToast]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const saveAppointment = async (payload: Appointment) => {
    try {
      if (appointmentId) {
        await updateAppointment(appointmentId, payload);
        showToast("Appointment updated successfully", "success");
        //  } else {
        //   await createAppointment(payload);
        //showToast("Appointment created successfully", "success");
      }
    } catch {
      showToast("Error saving appointment", "error");
    }
  };

  return { appointment, loading, saveAppointment };
};
