import axiosInstance from "./axiosInstance";

export const login = async (credentials: { email: string; password: string }) =>
  axiosInstance.post("/auth/login", credentials);

export const signup = async (credentials: {
  name: string;
  email: string;
  password: string;
}) => axiosInstance.post("/auth/signup", credentials);

export const logout = async () => axiosInstance.post("/auth/logout");
