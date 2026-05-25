import apiClient from "./apiClient";

const BON_COMMANDE_ROUTE = "/bon-commandes";

export const getBonCommandes = async (params = {}) => {
  const response = await apiClient.get(BON_COMMANDE_ROUTE, { params });
  return response.data;
};

export const getBonCommandeById = async (id) => {
  const response = await apiClient.get(`${BON_COMMANDE_ROUTE}/${id}`);
  return response.data;
};

export const createBonCommande = async (payload) => {
  const response = await apiClient.post(BON_COMMANDE_ROUTE, payload);
  return response.data;
};

export const updateBonCommande = async (id, payload) => {
  const response = await apiClient.put(`${BON_COMMANDE_ROUTE}/${id}`, payload);
  return response.data;
};

export const updateBonCommandeLineQuantity = async (id, lineId, payload) => {
  const response = await apiClient.put(`${BON_COMMANDE_ROUTE}/${id}/lines/${lineId}`, payload);
  return response.data;
};

export const bonCommandeApi = {
  getBonCommandes,
  getBonCommandeById,
  createBonCommande,
  updateBonCommande,
  updateBonCommandeLineQuantity,
};

export default bonCommandeApi;
