import apiClient from "./apiClient";

const TARGET_ROUTE = "/targets";

export const getAllTargets = async (params = {}) => {
  const response = await apiClient.get(TARGET_ROUTE, { params });
  return response.data;
};

export const getCurrentMonthTargets = async () => {
  const response = await apiClient.get(`${TARGET_ROUTE}/current-month`);
  return response.data;
};

export const getTargetAnalytics = async (year = null) => {
  const params = year ? { year } : {};
  const response = await apiClient.get(`${TARGET_ROUTE}/analytics/summary`, { params });
  return response.data;
};

export const createTarget = async (payload) => {
  const response = await apiClient.post(TARGET_ROUTE, payload);
  return response.data;
};

export const updateTarget = async (targetId, payload) => {
  const response = await apiClient.put(`${TARGET_ROUTE}/${targetId}`, payload);
  return response.data;
};

export const deleteTarget = async (targetId) => {
  const response = await apiClient.delete(`${TARGET_ROUTE}/${targetId}`);
  return response.data;
};

export const updateTargetProgress = async (targetId, amount, operation = "add") => {
  const response = await apiClient.post(`${TARGET_ROUTE}/${targetId}/update-progress`, {
    amount,
    operation,
  });
  return response.data;
};

export default {
  getAllTargets,
  getCurrentMonthTargets,
  getTargetAnalytics,
  createTarget,
  updateTarget,
  deleteTarget,
  updateTargetProgress,
};