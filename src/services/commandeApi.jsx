import apiClient from "./apiClient";

const COMMANDE_ROUTE = "/commandes";

export const getCommandes = async (params = {}) => {
  const response = await apiClient.get(COMMANDE_ROUTE, { params });
  return response.data;
};

export const getCommandeById = async (id) => {
  const response = await apiClient.get(`${COMMANDE_ROUTE}/${id}`);
  return response.data;
};

export const createCommande = async (payload) => {
  const response = await apiClient.post(COMMANDE_ROUTE, payload);
  return response.data;
};

export const updateCommande = async (id, payload) => {
  const response = await apiClient.put(`${COMMANDE_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteCommande = async (id) => {
  const response = await apiClient.delete(`${COMMANDE_ROUTE}/${id}`);
  return response.data;
};

export const commandeApi = {
  getCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
};

export default commandeApi;