import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LOGIN_PAGE_DEFAULTS } from "../defaults/loginPage_default";
import "./LoginPage.css";
import AuthTemplate from "../../../templates/AuthTemplate/AuthTemplate";
import { loginUser } from "../../../redux/reducers/UserReducer";
import { resolveDashboardByRole } from "../../../constants/roles";
function LoginPage(props) {
  const { templateProps } = { ...LOGIN_PAGE_DEFAULTS, ...props };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const getDashboardByRole = (role) => resolveDashboardByRole(role);


  const handleSubmit = async (event) => {
  if (event?.preventDefault) {
      event.preventDefault();
    }

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");

    const result = await dispatch(loginUser({ email, password }));

    if (result?.success) {
      navigate(getDashboardByRole(result.user?.role));
      return;
    }

    setError(result?.error || "Identifiants invalides ou erreur serveur.");
  };

  const resolvedTemplateProps = {
    ...templateProps,
    loginFormProps: {
      ...templateProps.loginFormProps,
      formType: "login",
      onSubmit: handleSubmit,
      emailValue: email,
      passwordValue: password,
      onEmailChange: (event) => setEmail(event.target.value),
      onPasswordChange: (event) => setPassword(event.target.value),
      error,
    },
  };

  return <AuthTemplate {...resolvedTemplateProps} />;
}

export default LoginPage;