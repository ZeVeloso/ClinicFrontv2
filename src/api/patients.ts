import axiosInstance from "./axiosInstance";

export const fetchNextPatient = async (): Promise<{
  id: string;
  name: string;
  details: string;
}> => {
  const response = await axiosInstance.get("/patients");

  return response.data;
};

export const getPatients = async () => {
  const response = await axiosInstance.get("/patients");
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
