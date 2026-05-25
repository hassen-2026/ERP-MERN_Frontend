import { useEffect, useMemo, useState } from "react";
import { Tag, message } from "antd";

import TemplateSelector from "../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../components/organisms/PageHeader/PageHeader";
import MainDataTable from "../../components/organisms/MainDataTable/MainDataTable";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationsApi";

const TYPE_COLORS = {
  LOW_STOCK: "orange",
  ACHAT_CREATED: "blue",
  BON_COMMANDE_CREATED: "geekblue",
  GENERAL: "default",
};

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString("fr-FR");
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const [items, unread] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      setNotifications(Array.isArray(items) ? items : []);
      setUnreadCount(Number(unread?.unreadCount || 0));
    } catch (fetchError) {
      const messageText = fetchError?.response?.data?.message || "Erreur lors du chargement des notifications.";
      setError(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const rows = useMemo(() => {
    return notifications.map((notification) => ({
      id: notification._id,
      title: notification.title || "-",
      message: notification.message || "-",
      type: notification.type || "GENERAL",
      typeLabel: notification.type || "GENERAL",
      status: notification.readAt ? "Lue" : "Non lue",
      statusTag: notification.readAt ? "success" : "warning",
      date: formatDate(notification.createdAt),
      readAt: notification.readAt,
    }));
  }, [notifications]);

  const columns = [
    { key: "title", header: "Titre" },
    { key: "message", header: "Message" },
    {
      key: "typeLabel",
      header: "Type",
      render: (row) => <Tag color={TYPE_COLORS[row.type] || "default"}>{row.typeLabel}</Tag>,
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => <Tag color={row.statusTag}>{row.status}</Tag>,
    },
    { key: "date", header: "Date" },
  ];

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      message.success("Toutes les notifications ont été marquées comme lues.");
      await loadNotifications();
    } catch (markError) {
      const messageText = markError?.response?.data?.message || "Impossible de marquer les notifications comme lues.";
      message.error(messageText);
    }
  };

  const getActions = (row) => {
    if (row.readAt) {
      return [];
    }

    return [
      {
        kind: "receive",
        label: "Marquer lue",
        onClick: async () => {
          try {
            await markNotificationAsRead(row.id);
            message.success("Notification marquée comme lue.");
            await loadNotifications();
          } catch (markError) {
            const messageText = markError?.response?.data?.message || "Impossible de marquer la notification comme lue.";
            message.error(messageText);
          }
        },
      },
    ];
  };

  return (
    <TemplateSelector>
      <PageHeader
        title="Notifications"
        subtitle={`Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}.`}
        actions={[
          {
            id: "mark-all-read",
            label: "Tout marquer comme lu",
            kind: "receive",
            disabled: unreadCount === 0,
            onClick: handleMarkAllRead,
          },
        ]}
      />
      <MainDataTable
        rows={rows}
        columns={columns}
        loading={loading}
        error={error}
        emptyMessage="Aucune notification disponible."
        getRowKey={(row) => row.id}
        getActions={getActions}
        actionColumnHeader="Action"
        actionColumnWidth={220}
      />
    </TemplateSelector>
  );
}

export default NotificationsPage;
