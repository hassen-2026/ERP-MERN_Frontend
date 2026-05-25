import apiClient from "./apiClient";

const USER_ROUTE = "/users";

export const getUsers = async (params = {}) => {
  const response = await apiClient.get(USER_ROUTE, { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`${USER_ROUTE}/${id}`);
  return response.data;
};

export const createUser = async (payload) => {
  const response = await apiClient.post(USER_ROUTE, payload);
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await apiClient.put(`${USER_ROUTE}/${id}`, payload);
  return response.data;
};

export const patchUser = async (id, payload) => {
  const response = await apiClient.patch(`${USER_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`${USER_ROUTE}/${id}`);
  return response.data;
};

export const userApi = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
};

export default userApi;
