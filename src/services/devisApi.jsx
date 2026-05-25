import apiClient from "./apiClient";

const DEVIS_ROUTE = "/devis";

export const getDevis = async (params = {}) => {
  const response = await apiClient.get(DEVIS_ROUTE, { params });
  return response.data;
};

export const getDevisById = async (id) => {
  const response = await apiClient.get(`${DEVIS_ROUTE}/${id}`);
  return response.data;
};

export const createDevis = async (payload) => {
  const response = await apiClient.post(DEVIS_ROUTE, payload);
  return response.data;
};

export const updateDevis = async (id, payload) => {
  const response = await apiClient.put(`${DEVIS_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteDevis = async (id) => {
  const response = await apiClient.delete(`${DEVIS_ROUTE}/${id}`);
  return response.data;
};

export const downloadDevisPdf = async (id) => {
  const response = await apiClient.get(`${DEVIS_ROUTE}/${id}/pdf`, {
    responseType: "blob"
  });
  return response.data;
};

export const devisApi = {
  getDevis,
  getDevisById,
  createDevis,
  updateDevis,
  deleteDevis,
  downloadDevisPdf,
};

export default devisApi;