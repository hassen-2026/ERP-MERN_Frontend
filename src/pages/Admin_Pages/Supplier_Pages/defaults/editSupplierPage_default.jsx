import { ADD_SUPPLIER_PAGE_DEFAULTS } from "./addSupplierPage_default";

export const EDIT_SUPPLIER_PAGE_DEFAULTS = {
  shellProps: {},
  notFoundMessage: "Fournisseur introuvable.",
  loadingMessage: "Chargement du fournisseur...",
  addSupplierProps: {
    ...ADD_SUPPLIER_PAGE_DEFAULTS.addSupplierProps,
    formTitle: "Mise à jour fournisseur",
    actionLabels: {
      save: "Mettre à jour",
      cancel: "Annuler",
    },
  },
};
