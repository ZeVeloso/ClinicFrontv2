import { useState, useEffect, useCallback } from "react";
import { getAppointments } from "../../../api/appointments";
import { Appointment } from "../types";
import { useAppointmentActions } from "./useAppointmentActions";
import { useToast } from "../../../contexts/ToastContext";

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
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const { showToast } = useToast();
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

  const handleStatusAction = async (
    id: string,
    action: "cancel" | "complete",
    onSuccess?: () => void
  ) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      if (action === "cancel") {
        await cancelAppointment(id);
        showToast("Appointment cancelled successfully", "success");
      } else {
        await toggleAppointmentStatus(id);
        showToast("Appointment status updated successfully", "success");
      }
      await fetchAppointments(); // Refresh the list after action
      onSuccess?.();
    } catch (error) {
      showToast("Error updating appointment", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return {
    appointments,
    totalAppointments,
    loading,
    error,
    actionLoading,
    addAppointment,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
    handleStatusAction,
    refreshAppointments: fetchAppointments,
  };
};

export default useAppointments;
