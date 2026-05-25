import apiClient from "./apiClient";

const ACHAT_ROUTE = "/achats";

export const getAchats = async (params = {}) => {
  const response = await apiClient.get(ACHAT_ROUTE, { params });
  return response.data;
};

export const getAchatById = async (id) => {
  const response = await apiClient.get(`${ACHAT_ROUTE}/${id}`);
  return response.data;
};

export const createAchat = async (payload) => {
  const response = await apiClient.post(ACHAT_ROUTE, payload);
  return response.data;
};

export const updateAchat = async (id, payload) => {
  const response = await apiClient.put(`${ACHAT_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteAchat = async (id) => {
  const response = await apiClient.delete(`${ACHAT_ROUTE}/${id}`);
  return response.data;
};

export const receiveAchat = async (id, payload = {}) => {
  try {
    // payload may be an array of indexes (legacy) or an object { itemIndexes } / { items }
    const body = Array.isArray(payload) ? { itemIndexes: payload } : payload || {};
    const response = await apiClient.patch(`${ACHAT_ROUTE}/${id}/receive`, body);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404 || error?.response?.status === 405) {
      const fallbackBody = Array.isArray(payload) ? { itemIndexes: payload } : payload || {};
      const fallbackResponse = await apiClient.post(`${ACHAT_ROUTE}/${id}/receive`, fallbackBody);
      return fallbackResponse.data;
    }

    throw error;
  }
};

export const extractAchatInvoiceOcr = async (file, provider = "textract") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("provider", provider);

  const response = await apiClient.post(`${ACHAT_ROUTE}/ocr/invoice`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const achatApi = {
  getAchats,
  getAchatById,
  createAchat,
  updateAchat,
  deleteAchat,
  receiveAchat,
  extractAchatInvoiceOcr,
};

export default achatApi;
