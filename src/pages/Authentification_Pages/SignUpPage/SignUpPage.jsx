import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { SIGNUP_PAGE_DEFAULTS } from "../defaults/signUpPage_default";
import "./SignUpPage.css";
import AuthTemplate from "../../../templates/AuthTemplate/AuthTemplate";
import { ROLES, normalizeRole, resolveSignupRoleBySlug, SIGNUP_ROLE_OPTIONS } from "../../../constants/roles";
import { register as registerUser } from "../../../services/authApi";

function SignUpPage(props) {
  const { templateProps } = { ...SIGNUP_PAGE_DEFAULTS, ...props };
  const navigate = useNavigate();
  const { roleSlug } = useParams();
  const [searchParams] = useSearchParams();

  const roleFromParams = useMemo(() => {
    const fromSlug = resolveSignupRoleBySlug(roleSlug);
    if (fromSlug) return fromSlug;

    const fromQuery = normalizeRole(searchParams.get("role"));
    const validRoles = new Set(SIGNUP_ROLE_OPTIONS.map((option) => option.value));
    return validRoles.has(fromQuery) ? fromQuery : ROLES.USER;
  }, [roleSlug, searchParams]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(roleFromParams);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setRole(roleFromParams);
  }, [roleFromParams]);

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Tous les champs sont obligatoires.");
      return false;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Adresse e-mail invalide.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("role", role);
      if (image) {
        formData.append("image", image);
      }

      await registerUser(formData);

      // Inscription réussie
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  const resolvedTemplateProps = {
    ...templateProps,
    loginFormProps: {
      ...templateProps.loginFormProps,
      formType: "signup",
      onSubmit: handleSubmit,
      firstNameValue: firstName,
      lastNameValue: lastName,
      emailValue: email,
      passwordValue: password,
      confirmPasswordValue: confirmPassword,
      roleValue: role,
      onFirstNameChange: (event) => setFirstName(event.target.value),
      onLastNameChange: (event) => setLastName(event.target.value),
      onEmailChange: (event) => setEmail(event.target.value),
      onPasswordChange: (event) => setPassword(event.target.value),
      onConfirmPasswordChange: (event) => setConfirmPassword(event.target.value),
      onRoleChange: (value) => setRole(value),
      onImageChange: (event) => setImage(event.target.files?.[0] || null),
      roles: SIGNUP_ROLE_OPTIONS,
      error,
    },
  };

  return <AuthTemplate {...resolvedTemplateProps} />;
}

export default SignUpPage;
