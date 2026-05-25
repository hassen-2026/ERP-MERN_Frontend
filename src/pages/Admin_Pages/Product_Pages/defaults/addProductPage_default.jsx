import { ENTITY_FORM_DEFAULTS } from "../../../../components/organisms/defaults/addProduct_default";

/**
 * Configuration pour la page AddProduct
 * Étend ENTITY_FORM_DEFAULTS avec les options dynamiques
 */
export const ADD_PRODUCT_PAGE_DEFAULTS = {
  templateProps: {
    shellProps: {},
    title: "Ajouter un produit",
    pageFooterText: "© 2026 Gestion Stock/Ventes/Achats - Tous droits réservés",
  },
  addProductProps: {
    ...ENTITY_FORM_DEFAULTS,
   
    fields: {
      ...ENTITY_FORM_DEFAULTS.fields,
      category: {
        ...ENTITY_FORM_DEFAULTS.fields.category,
        options: [
          { label: "Accessoires", value: "accessoires" },
          { label: "Électronique", value: "electronique" },
        ],
      },
      baseUnit: {
        ...ENTITY_FORM_DEFAULTS.fields.baseUnit,
        options: [
          { label: "---------", value: "" },
          { label: "Pièce", value: "piece" },
          { label: "Kg", value: "kg" },
          { label: "Litre", value: "litre" },
        ],
      },
    },
  },
};
