import axiosInstance from "./axiosInstance";
import { Patient } from "../types/Patient";

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

export const createAppointment = async (id: string) => {
  const newAppointment = {
    date: new Date().toISOString(),
    motive: "Check-up1", // Example default value
    status: "C",
    obs: "",
  };
  const response = await axiosInstance.post(
    `/patients/${id}/appointments`,
    newAppointment
  );
  return response.data.data;
};
