export const PRODUCT_DETAIL_PAGE_DEFAULTS = {
  shellProps: {},
  notFoundMessage: "Produit introuvable.",
  infoRows: [
    { label: "Référence", key: "reference" },
    { label: "Catégorie", key: "categorie" },
    { 
      label: "Taux TVA", 
      key: "tvaRate", 
      formatter: (value) => `${(Number(value || 0.19) * 100).toFixed(2)}%`
    },
    { 
      label: "Prix d'achat HTVA", 
      key: "purchasePriceHT", 
      formatter: (value) => `${Number(value || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}` 
    },
    { 
      label: "Prix d'achat TTC", 
      key: "purchasePriceTTC", 
      formatter: (value) => `${Number(value || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}` 
    },
    { 
      label: "Prix de vente HTVA", 
      key: "salePriceHT", 
      formatter: (value) => `${Number(value || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}` 
    },
    { 
      label: "Prix de vente TTC", 
      key: "salePriceTTC", 
      formatter: (value) => `${Number(value || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}` 
    },
    { label: "Seuil d'alerte stock", key: "minThreshold" },
    { label: "Stock actuel", key: "quantity" },
    { label: "Créé", key: "createdAt" },
    { label: "Modifié", key: "updatedAt" },
  ],
};
