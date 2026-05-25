import { ENTITY_FORM_DEFAULTS } from "../../../../components/organisms/defaults/addProduct_default";

export const ADD_SUPPLIER_PAGE_DEFAULTS = {
  templateProps: {
    shellProps: {},
    title: "Ajouter un fournisseur",
  },
  addSupplierProps: {
    ...ENTITY_FORM_DEFAULTS,
    formTitle: "Ajouter un fournisseur",
    fields: {
      firstName: {
        label: "Prénom",
        placeholder: "Prénom du fournisseur",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      lastName: {
        label: "Nom",
        placeholder: "Nom du fournisseur",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      email: {
        label: "Email",
        placeholder: "fournisseur@exemple.com",
        type: "input",
        inputType: "email",
        defaultValue: "",
      },
      phone: {
        label: "Téléphone",
        placeholder: "+212 6XX-XXX-XXX",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      matriculeFiscale: {
        label: "Matricule Fiscale",
        placeholder: "MF-123456",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      country: {
        label: "Pays",
        placeholder: "Maroc",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      city: {
        label: "Ville",
        placeholder: "Casablanca",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      address: {
        label: "Adresse",
        placeholder: "Adresse complète",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
      imageUrl: {
        label: "URL image",
        placeholder: "https://...",
        type: "input",
        inputType: "text",
        defaultValue: "",
      },
    },
    fieldOrder: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "matriculeFiscale",
      "country",
      "city",
      "address",
      "imageUrl",
    ],
    actionLabels: {
      save: "Enregistrer",
      cancel: "Annuler",
    },
  },
};
