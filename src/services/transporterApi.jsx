import apiClient from "./apiClient";

const TRANSPORTER_ROUTE = "/transporters";

export const getTransporters = async (params = {}) => {
  const response = await apiClient.get(TRANSPORTER_ROUTE, { params });
  return response.data;
};

export const createTransporter = async (payload) => {
  const response = await apiClient.post(TRANSPORTER_ROUTE, payload);
  return response.data;
};

export const updateTransporter = async (id, payload) => {
  const response = await apiClient.put(`${TRANSPORTER_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteTransporter = async (id) => {
  const response = await apiClient.delete(`${TRANSPORTER_ROUTE}/${id}`);
  return response.data;
};

export const transporterApi = {
  getTransporters,
  createTransporter,
  updateTransporter,
  deleteTransporter,
};

export default transporterApi;
