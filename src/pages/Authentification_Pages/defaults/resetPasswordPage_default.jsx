export const RESET_PASSWORD_PAGE_DEFAULTS = {
  templateProps: {
    title: "Réinitialiser votre mot de passe",
    subtitle: "Entrez votre nouveau mot de passe",
    brand: "Gestion Stock",
    footer: "Retour à <a href='/login'>la connexion</a>",
    alertMessage: "",
    loginFormProps: {
      buttonText: "Réinitialiser le mot de passe",
    },
  },
  successPath: "/login",
};
