import axiosInstance from "./axiosInstance";
import { RevenueData, ManagementStats } from "../features/management/types";

export const fetchMonthlyEarnings = async (): Promise<number> => {
  const response = await axiosInstance.get("/earnings");
  return response.data;
};

export const fetchManagementStats = async (): Promise<ManagementStats> => {
  const response = await axiosInstance.get(`/analytics/dashboard`);
  return response.data.data;
};

export const fetchRevenueData = async (
  timeRange: string
): Promise<RevenueData> => {
  const response = await axiosInstance.get("/analytics/revenue", {
    params: { timeRange },
  });
  return response.data;
};
