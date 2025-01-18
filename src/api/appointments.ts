import axiosInstance from "./axiosInstance";
import { Patient } from "../types/Patient";
import { Appointment } from "../types/Appointment";

export const getAppointments = async (): Promise<
  { id: string; obs: string; date: string }[]
> => {
  const response = await axiosInstance.get("/appointments");
  return response.data.data;
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
  const response = await axiosInstance.put(
    `/appointments/${id}`,
    updatedAppointment
  );
  return response.data;
};
