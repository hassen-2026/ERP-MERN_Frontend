import apiClient from "./apiClient";

const PAIEMENT_ROUTE = "/paiements";

export const getPaiements = async (params = {}) => {
  const response = await apiClient.get(PAIEMENT_ROUTE, { params });
  return response.data;
};

export const getPaiementById = async (id) => {
  const response = await apiClient.get(`${PAIEMENT_ROUTE}/${id}`);
  return response.data;
};

export const createPaiement = async (payload) => {
  const response = await apiClient.post(PAIEMENT_ROUTE, payload);
  return response.data;
};

export const deletePaiement = async (id) => {
  const response = await apiClient.delete(`${PAIEMENT_ROUTE}/${id}`);
  return response.data;
};

export const paiementApi = {
  getPaiements,
  getPaiementById,
  createPaiement,
  deletePaiement,
};

export default paiementApi;