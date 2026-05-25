import apiClient from "./apiClient";

const SUPPLIER_ROUTE = "/suppliers";

export const getSuppliers = async (params = {}) => {
  const response = await apiClient.get(SUPPLIER_ROUTE, { params });
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await apiClient.get(`${SUPPLIER_ROUTE}/${id}`);
  return response.data;
};

export const createSupplier = async (payload) => {
  const response = await apiClient.post(SUPPLIER_ROUTE, payload);
  return response.data;
};

export const updateSupplier = async (id, payload) => {
  const response = await apiClient.put(`${SUPPLIER_ROUTE}/${id}`, payload);
  return response.data;
};

export const patchSupplier = async (id, payload) => {
  const response = await apiClient.patch(`${SUPPLIER_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await apiClient.delete(`${SUPPLIER_ROUTE}/${id}`);
  return response.data;
};

export const supplierApi = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  patchSupplier,
  deleteSupplier,
};

export default supplierApi;
