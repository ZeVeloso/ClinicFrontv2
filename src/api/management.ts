import axiosInstance from "./axiosInstance";

export const fetchMonthlyEarnings = async (): Promise<number> => {
  const response = await axiosInstance.get("/earnings");
  return response.data;
};
