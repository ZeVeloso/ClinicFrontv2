import axiosInstance from "./axiosInstance";

export const getAppointments = async (): Promise<
  { id: string; obs: string; date: string }[]
> => {
  const response = await axiosInstance.get("/appointments");
  return response.data.data;
};
