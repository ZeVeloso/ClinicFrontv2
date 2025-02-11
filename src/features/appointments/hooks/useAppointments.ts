import { useState, useEffect, useCallback } from "react";
import { getAppointments } from "../../../api/appointments";
import { Appointment } from "../types";
import { useAppointmentActions } from "./useAppointmentActions";

export interface AppointmentFilters {
  date: string;
  patient: string;
  phone: string;
  status: string;
}

export const useAppointments = (
  filters: AppointmentFilters,
  page: number,
  pageSize: number
) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAppointments({
        ...filters,
        page: page + 1,
        pageSize,
      });
      setAppointments(response.data);
      setTotalAppointments(response.total);
    } catch (err) {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Use the modified appointment actions that perform in-memory updates
  const {
    addAppointment,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
  } = useAppointmentActions(appointments, setAppointments);

  return {
    appointments,
    totalAppointments,
    loading,
    error,
    addAppointment,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
    refreshAppointments: fetchAppointments,
  };
};

export default useAppointments;
