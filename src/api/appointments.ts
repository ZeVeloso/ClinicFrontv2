import axiosInstance from "./axiosInstance";
import { Patient } from "../features/patients/types";
import { Appointment } from "../features/appointments/types";

export const getAppointments = async ({
  patient = "",
  phone = "",
  date = "",
  status = "",
  page = 1,
  pageSize = 20,
}) => {
  const response = await axiosInstance.get("/appointments", {
    params: { patient, phone, date, status, page, pageSize },
  });
  return response.data;
};

export const getAppointmentsByPatientId = async (
  id: string
): Promise<
  {
    id: string;
    patient: Patient;
    date: string;
    motive: string;
    status: string;
    obs: string;
  }[]
> => {
  const response = await axiosInstance.get(`/patients/${id}/appointments`);
  return response.data.data;
};

export const createAppointment = async (
  id: string,
  appointmentData: {
    date: string;
    motive: string;
    obs: string;
  }
) => {
  const response = await axiosInstance.post(
    `/patients/${id}/appointments`,
    appointmentData
  );
  return response.data.data;
};

export const updateAppointment = async (
  id: string,
  updatedAppointment: Appointment
) => {
  const { patient, ...appointmentData } = updatedAppointment;
  const response = await axiosInstance.put(
    `/appointments/${id}`,
    appointmentData
  );
  return response.data;
};
