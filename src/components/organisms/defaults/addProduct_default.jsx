/**
 * Configuration générique pour le composant AddProduct
 * Peut être utilisée directement pour formulaires produits
 * Ou modifiée dans chaque page pour d'autres use-cases (clients, fournisseurs, etc.)
 */
export const ENTITY_FORM_DEFAULTS = {
  formTitle: "Formulaire produit",
  fields: {
    name: {
      label: "Nom",
      placeholder: "Nom du produit",
      type: "input",
      inputType: "text",
      defaultValue: "",
    },
    reference: {
      label: "Référence",
      placeholder: "REF-0001",
      type: "input",
      inputType: "text",
      defaultValue: "",
    },
    description: {
      label: "Description",
      placeholder: "Description",
      type: "input",
      inputType: "text",
      defaultValue: "",
    },
    category: {
      label: "Catégorie",
      placeholder: "Sélectionner une catégorie",
      type: "select",
      options: [],
      defaultValue: "",
      required: true,
    },
    tvaRate: {
      label: "Taux TVA",
      type: "display",
      defaultValue: "0.00%",
      readOnly: true,
    },
    buyPrice: {
      label: "Prix d'achat HTVA",
      placeholder: "0",
      type: "input",
      inputType: "number",
      defaultValue: "0",
    },
    buyPriceTTC: {
      label: "Prix d'achat TTC",
      type: "display",
      defaultValue: "0.00 DT",
      readOnly: true,
    },
    sellPrice: {
      label: "Prix de vente HTVA",
      placeholder: "0",
      type: "input",
      inputType: "number",
      defaultValue: "0",
    },
    sellPriceTTC: {
      label: "Prix de vente TTC",
      type: "display",
      defaultValue: "0.00 DT",
      readOnly: true,
    },
    minThreshold: {
      label: "Seuil d'alerte stock",
      placeholder: "0",
      type: "input",
      inputType: "number",
      defaultValue: "0",
    },
    stockQuantity: {
      label: "Quantité en stock",
      placeholder: "0",
      type: "input",
      inputType: "number",
      defaultValue: "0",
    },
    image: {
      label: "Image",
      placeholder: "Sélectionnez une image",
      type: "input",
      inputType: "file",
      defaultValue: "",
    },
  },
  fieldOrder: ["name", "reference", "description", "category", "tvaRate", "buyPrice", "buyPriceTTC", "sellPrice", "sellPriceTTC", "minThreshold", "stockQuantity", "image"],
  actionLabels: {
    save: "Enregistrer",
    cancel: "Annuler",
  },
  initialValues: null,
  customClassName: "",
  stackClassName: "",
  saveButtonClassName: "p-add-product-btn p-add-product-btn--save",
  cancelButtonClassName: "p-add-product-btn p-add-product-btn--cancel",
  onSave: () => {},
  onCancel: () => {},
};
