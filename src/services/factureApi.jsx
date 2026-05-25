import apiClient from "./apiClient";

const FACTURE_ROUTE = "/factures";

export const getFactures = async (params = {}) => {
  const response = await apiClient.get(FACTURE_ROUTE, { params });
  return response.data;
};

export const getFactureById = async (id) => {
  const response = await apiClient.get(`${FACTURE_ROUTE}/${id}`);
  return response.data;
};

export const createFacture = async (payload) => {
  const response = await apiClient.post(FACTURE_ROUTE, payload);
  return response.data;
};

export const updateFacture = async (id, payload) => {
  const response = await apiClient.put(`${FACTURE_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteFacture = async (id) => {
  const response = await apiClient.delete(`${FACTURE_ROUTE}/${id}`);
  return response.data;
};

export const extractFactureInvoiceOcr = async (file, provider = "openai") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("provider", provider);

  const response = await apiClient.post(`${FACTURE_ROUTE}/ocr/invoice`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const factureApi = {
  getFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
  extractFactureInvoiceOcr,
};

export default factureApi;