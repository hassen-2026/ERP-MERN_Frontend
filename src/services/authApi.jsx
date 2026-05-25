import apiClient from "./apiClient";

const AUTH_ROUTE = "/auth";

export const login = async (email, password) => {
  const response = await apiClient.post(`${AUTH_ROUTE}/login`, { email, password });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post(`${AUTH_ROUTE}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await apiClient.post(`${AUTH_ROUTE}/reset-password`, {
    token,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

export const register = async (payload) => {
  // If payload is FormData (when uploading image), don't set Content-Type header
  // Let the browser set it automatically with the correct boundary
  const config = payload instanceof FormData ? {
    headers: {
      "Content-Type": undefined,
    },
  } : {};
  
  const response = await apiClient.post(`${AUTH_ROUTE}/register`, payload, config);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get(`${AUTH_ROUTE}/me`);
  return response.data;
};

export const refreshToken = async (refreshTokenValue) => {
  const response = await apiClient.post(`${AUTH_ROUTE}/refresh`, {
    refreshToken: refreshTokenValue,
  });
  return response.data;
};

export const logoutRequest = async () => {
  const response = await apiClient.post(`${AUTH_ROUTE}/logout`);
  return response.data;
};

export const authApi = {
  login,
  forgotPassword,
  resetPassword,
  register,
  getCurrentUser,
  refreshToken,
  logoutRequest,
};

export default authApi;
