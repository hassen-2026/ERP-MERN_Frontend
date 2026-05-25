export const FORGET_PASSWORD_PAGE_DEFAULTS = {
  templateProps: {
    title: "Mot de passe oublié",
    subtitle: "Entrez votre e-mail pour recevoir un lien de réinitialisation",
    brand: "Gestion Stock",
    footer: "Retour à <a href='/login'>la connexion</a>",
    alertMessage: "",
    loginFormProps: {
      buttonText: "Envoyer un lien de réinitialisation",
    },
  },
  successPath: "/login",
};
