import axiosInstance from "./axiosInstance";
import { Patient } from "../types/Patient";

export const getPatients = async () => {
  const response = await axiosInstance.get("/patients");
  return response.data;
};

export const fetchNextPatient = async (): Promise<{
  id: string;
  name: string;
  details: string;
}> => {
  const response = await axiosInstance.get("/patients");
  return response.data;
};

export const getPatient = async (id: string) => {
  const response = await axiosInstance.get(`/patients/${id}`);
  return response.data;
};

export const addPatient = async (patientData: {
  name: string;
  phone: number;
  birth: string;
  gender: string;
  job: string;
  address: string;
}) => {
  try {
    const response = await axiosInstance.post("/patients", patientData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding patient");
  }
};

export const updatePatient = async (id: string, updatedPatient: Patient) => {
  const response = await axiosInstance.put(`/patients/${id}`, updatedPatient);
  return response.data;
};
