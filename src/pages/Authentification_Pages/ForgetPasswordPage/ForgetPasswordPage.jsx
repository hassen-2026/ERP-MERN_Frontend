import { useState } from "react";

import { forgotPassword } from "../../../services/authService";
import { FORGET_PASSWORD_PAGE_DEFAULTS } from "../defaults/forgetPasswordPage_default";
import "./ForgetPasswordPage.css";
import AuthTemplate from "../../../templates/AuthTemplate/AuthTemplate";

function ForgetPasswordPage(props) {
  const { templateProps } = { ...FORGET_PASSWORD_PAGE_DEFAULTS, ...props };
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Veuillez entrer votre adresse e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Adresse e-mail invalide.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);

      setSuccess("Un lien de réinitialisation a été envoyé à votre e-mail.");
      setEmail("");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  const resolvedTemplateProps = {
    ...templateProps,
    loginFormProps: {
      ...templateProps.loginFormProps,
      formType: "forget-password",
      onSubmit: handleSubmit,
      emailValue: email,
      onEmailChange: (event) => setEmail(event.target.value),
      error,
      success,
      isLoading,
    },
  };

  return <AuthTemplate {...resolvedTemplateProps} />;
}

export default ForgetPasswordPage;
