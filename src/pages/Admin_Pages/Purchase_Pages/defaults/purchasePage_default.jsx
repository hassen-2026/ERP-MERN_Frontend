export const PURCHASE_PAGE_DEFAULTS = {
  shellProps: {},
  statsClassName: "",
  statCardProps: {
    containerClassName: "p-stat-card",
    defaultValueClassName: "p-stat-card__value",
    defaultLabelClassName: "p-stat-card__label",
  },
  title: "Gestion des Achats",
  subtitle: "Suivez les commandes fournisseurs, leur statut et leur impact stock.",
  filters: {
    search: {
      placeholder: "Numero, fournisseur, cree par...",
      value: "",
    },
    status: {
      value: "all",
    },
  },
  statusOptions: [
    { label: "Tous les statuts", value: "all" },
    { label: "En attente", value: "PENDING" },
    { label: "Recu", value: "RECEIVED" },
    { label: "Annule", value: "CANCELLED" },
  ],
};
