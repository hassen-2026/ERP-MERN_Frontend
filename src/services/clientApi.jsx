import apiClient from "./apiClient";

const CLIENT_ROUTE = "/clients";

export const getClients = async (params = {}) => {
  const response = await apiClient.get(CLIENT_ROUTE, { params });
  return response.data;
};

export const getClientById = async (id) => {
  const response = await apiClient.get(`${CLIENT_ROUTE}/${id}`);
  return response.data;
};

export const createClient = async (payload) => {
  const response = await apiClient.post(CLIENT_ROUTE, payload);
  return response.data;
};

export const updateClient = async (id, payload) => {
  const response = await apiClient.put(`${CLIENT_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await apiClient.delete(`${CLIENT_ROUTE}/${id}`);
  return response.data;
};

export const clientApi = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

export default clientApi;