export const FORGET_PASSWORD_FORM_DEFAULTS = {
  emailLabel: "Adresse e-mail",
  emailPlaceholder: "Entrez votre adresse e-mail",
  buttonText: "Envoyer un lien de réinitialisation",
  onSubmit: () => {},
  emailValue: "",
  onEmailChange: () => {},
  error: "",
  success: "",
  isLoading: false,
  customClassName: "",
  emailFieldProps: {
    customClassName: "p-field",
    labelClassName: "p-field__label",
    errorClassName: "p-field__error",
  },
  submitButtonClassName: "",
  errorClassName: "p-login__alert",
  successClassName: "p-login__success",
  infoText:
    "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
};