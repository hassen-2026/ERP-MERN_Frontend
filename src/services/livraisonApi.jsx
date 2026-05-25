import apiClient from "./apiClient";

const LIVRAISON_ROUTE = "/livraisons";

export const getLivraisons = async (params = {}) => {
  const response = await apiClient.get(LIVRAISON_ROUTE, { params });
  return response.data;
};

export const getLivraisonById = async (id) => {
  const response = await apiClient.get(`${LIVRAISON_ROUTE}/${id}`);
  return response.data;
};

export const createLivraison = async (payload) => {
  const response = await apiClient.post(LIVRAISON_ROUTE, payload);
  return response.data;
};

export const assignLivraisonTransporter = async (id, payload) => {
  const response = await apiClient.put(`${LIVRAISON_ROUTE}/${id}/assign-transporter`, payload);
  return response.data;
};

export const downloadLivraisonDeliveryNotePdf = async (id) => {
  const response = await apiClient.get(`${LIVRAISON_ROUTE}/${id}/bon-livraison/pdf`, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  });

  return response.data;
};

export const livraisonApi = {
  getLivraisons,
  getLivraisonById,
  createLivraison,
  assignLivraisonTransporter,
  downloadLivraisonDeliveryNotePdf,
};

export default livraisonApi;
