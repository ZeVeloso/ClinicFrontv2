import axiosInstance from "./axiosInstance";
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
): Promise<Appointment[]> => {
  const response = await axiosInstance.get(`/patients/${id}/appointments`);
  return response.data.data;
};

export const getAppointment = async (id: string): Promise<Appointment> => {
  const response = await axiosInstance.get(`/appointments/${id}`);
  return response.data.data;
};

export const createAppointment = async (
  id: string,
  appointmentData: Appointment
) => {
  const response = await axiosInstance.post(
    `/patients/${id}/appointments`,
    appointmentData
  );
  return response.data.data;
};

export const createAppointment2 = async (appointmentData: Appointment) => {
  const response = await axiosInstance.post(`/appointments`, appointmentData);
  return response.data.data;
};

export const updateAppointment = async (
  id: string,
  updatedAppointment: Appointment
) => {
  const { patient, ...appointmentData } = updatedAppointment;
  const response = await axiosInstance.put(`/appointments/${id}`, {
    patientId: patient?.id,
    ...appointmentData,
  });
  return response.data;
};
