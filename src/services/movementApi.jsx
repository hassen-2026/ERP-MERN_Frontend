import apiClient from "./apiClient";

const MOVEMENT_ROUTE = "/stock-movements";

export const getMovements = async (params = {}) => {
  const response = await apiClient.get(MOVEMENT_ROUTE, { params });
  return response.data;
};

export const getMovementById = async (id) => {
  const response = await apiClient.get(`${MOVEMENT_ROUTE}/${id}`);
  return response.data;
};

export const createMovement = async (payload) => {
  const response = await apiClient.post(MOVEMENT_ROUTE, payload);
  return response.data;
};

export const updateMovement = async (id, payload) => {
  const response = await apiClient.put(`${MOVEMENT_ROUTE}/${id}`, payload);
  return response.data;
};

export const patchMovement = async (id, payload) => {
  const response = await apiClient.patch(`${MOVEMENT_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteMovement = async (id) => {
  const response = await apiClient.delete(`${MOVEMENT_ROUTE}/${id}`);
  return response.data;
};

export const getMovementsByProduct = async (productId, params = {}) => {
  const response = await apiClient.get(`${MOVEMENT_ROUTE}/product/${productId}`, { params });
  return response.data;
};

export const getMovementsBySupplier = async (supplierId, params = {}) => {
  const response = await apiClient.get(`${MOVEMENT_ROUTE}/supplier/${supplierId}`, { params });
  return response.data;
};

export const movementApi = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  patchMovement,
  deleteMovement,
  getMovementsByProduct,
  getMovementsBySupplier,
};

export default movementApi;
