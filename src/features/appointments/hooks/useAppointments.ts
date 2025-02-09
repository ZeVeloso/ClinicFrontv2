import { useState, useEffect, useCallback } from "react";
import { getAppointments, createAppointment } from "../../../api/appointments";
import { Appointment } from "../types";

// Define an interface for your filters (adjust keys as needed)
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

  // Fetch appointments based on current filters and pagination
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

  const addAppointment = useCallback(
    async (appointmentData: any) => {
      try {
        await createAppointment(appointmentData.patientId, appointmentData);
        await fetchAppointments();
      } catch (err) {
        setError("Error creating appointment. Please try again.");
      }
    },
    [fetchAppointments]
  );

  return {
    appointments,
    totalAppointments,
    loading,
    error,
    addAppointment,
  };
};

export default useAppointments;
