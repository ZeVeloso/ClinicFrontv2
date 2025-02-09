import axiosInstance from "./axiosInstance";
import { Patient } from "../features/patients/types";

export const getPatients = async ({
  name = "",
  phone = "",
  page = 1,
  pageSize = 20,
}: {
  name?: string;
  phone?: string;
  page?: number;
  pageSize?: number;
}) => {
  const response = await axiosInstance.get("/patients", {
    params: { name, phone, page, pageSize },
  });
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
  phone: string;
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
