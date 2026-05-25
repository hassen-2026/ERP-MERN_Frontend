export const PRODUCT_PAGE_DEFAULTS = {
  shellProps: {},
  statsClassName: "",
  statCardProps: {
    containerClassName: "p-stat-card",
    defaultValueClassName: "p-stat-card__value",
    defaultLabelClassName: "p-stat-card__label",
  },
  title: "Gestion des Produits",
  subtitle: "Consultez le catalogue, filtrez les produits et pilotez rapidement les actions clés.",
  filters: {
    search: {
      placeholder: "Nom du produit...",
      value: "",
    },
    category: {
      value: "all",
    },
    stock: {
      value: "all",
    },
  },
  categoryOptions: [
    { label: "Toutes les catégories", value: "all" },
    { label: "Accessoires", value: "accessoires" },
    { label: "Électronique", value: "electronique" },
    { label: "Fournitures", value: "fournitures" },
  ],
  stockOptions: [
    { label: "Tous les produits", value: "all" },
    { label: "En stock", value: "in_stock" },
    { label: "Stock faible", value: "low_stock" },
    { label: "Rupture", value: "out_of_stock" },
  ],
};
