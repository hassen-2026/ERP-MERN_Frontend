import { forgotPassword as forgotPasswordRequest, login as loginRequest, resetPassword as resetPasswordRequest } from "./authApi";

export const login = async (email, password) => {
  return loginRequest(email, password);
};

export const forgotPassword = async (email) => {
  return forgotPasswordRequest(email);
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  return resetPasswordRequest(token, newPassword, confirmPassword);
};
