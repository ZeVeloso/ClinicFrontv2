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
