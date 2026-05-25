import apiClient from "./apiClient";

const NOTIFICATION_ROUTE = "/notifications";

export const getNotifications = async (params = {}) => {
  const response = await apiClient.get(NOTIFICATION_ROUTE, { params });
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await apiClient.get(`${NOTIFICATION_ROUTE}/unread-count`);
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await apiClient.patch(`${NOTIFICATION_ROUTE}/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.patch(`${NOTIFICATION_ROUTE}/read-all`);
  return response.data;
};

export default {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
