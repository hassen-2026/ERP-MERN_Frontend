import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Authentification_Pages/LoginPage/LoginPage";
import SignUpPage from "../pages/Authentification_Pages/SignUpPage/SignUpPage";
import ResetPasswordPage from "../pages/Authentification_Pages/ResetPasswordPage/ResetPasswordPage";

// Exemple de structure de routes à ajouter à MainRoute.js

export const AuthRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;

// TODO: Ajouter ces routes à votre structure principale
// 1. Importer AuthRoutes dans MainRoute.js
// 2. Ajouter les routes au composant Router principal
// 3. Mettre à jour les liens de navigation (Login, SignUp, Reset Password)
