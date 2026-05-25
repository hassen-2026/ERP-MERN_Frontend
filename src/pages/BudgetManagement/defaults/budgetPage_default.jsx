export const BUDGET_PAGE_DEFAULTS = {
  shellProps: {},
  statsClassName: "",
  statCardProps: {
    containerClassName: "p-stat-card",
    defaultValueClassName: "p-stat-card__value",
    defaultLabelClassName: "p-stat-card__label",
  },
  title: "Gestion des Budgets",
  subtitle: "Créez, filtrez et pilotez les budgets par catégorie et période.",
  filters: {
    search: {
      placeholder: "Nom, créateur, notes...",
      value: "",
    },
    status: "all",
  },
};