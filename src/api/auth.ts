import axiosInstance from "./axiosInstance";

export const login = async (credentials: { email: string; password: string }) =>
  axiosInstance.post("/auth/login", credentials);

export const signup = async (credentials: {
  name: string;
  email: string;
  password: string;
}) => axiosInstance.post("/auth/signup", credentials);

export const logout = async () => axiosInstance.post("/auth/logout");

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/logged");
  return response.data.data;
};

export const googleLogin = async (token: string) => {
  return axiosInstance.post("/auth/google", { token });
};

// src/api/auth.ts
export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.post("/auth/password-reset/request", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axiosInstance.post("/auth/password-reset/reset", {
    token,
    newPassword,
  });
  return response.data;
};
