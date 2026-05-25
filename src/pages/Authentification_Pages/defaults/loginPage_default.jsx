export const LOGIN_PAGE_DEFAULTS = {
  templateProps: {
    authTemplateProps: {
      title: "Connexion",
      subtitle: "Entrez vos identifiants pour continuer",
      brand: "Gestion Stock",
      footer: "",
      alertMessage: "Vous avez été déconnecté!",
    },
    loginFormProps: {
      buttonText: "Se connecter",
      emailLabel: "Nom d'utilisateur",
      passwordLabel: "Mot de passe",
    },
  },
  successPath: "/dashboard",
};
