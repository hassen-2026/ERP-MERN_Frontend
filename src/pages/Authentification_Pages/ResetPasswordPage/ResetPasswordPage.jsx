import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { resetPassword } from "../../../services/authApi";
import "./ResetPasswordPage.css";
import AuthTemplate from "../../../templates/AuthTemplate/AuthTemplate";

function ResetPasswordPage(props) {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Lien de réinitialisation invalide ou expiré.");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, newPassword, confirmPassword);

      setSuccess("Votre mot de passe a été réinitialisé avec succès!");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate
      title="Réinitialiser votre mot de passe"
      subtitle="Entrez votre nouveau mot de passe"
      brand="Gestion Stock"
      footer="Retour à <a href='/login'>la connexion</a>"
      loginFormProps={{
        formType: "reset-password",
        onSubmit: handleSubmit,
        newPasswordValue: newPassword,
        confirmPasswordValue: confirmPassword,
        onNewPasswordChange: (event) => setNewPassword(event.target.value),
        onConfirmPasswordChange: (event) => setConfirmPassword(event.target.value),
        error,
        success,
        isLoading,
      }}
    />
  );
}

export default ResetPasswordPage;
