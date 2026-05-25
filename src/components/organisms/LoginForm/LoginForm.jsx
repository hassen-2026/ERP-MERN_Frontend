import Button from "../../atoms/button/Button";
import InputField from "../../molecules/InputField/InputField";
import { LOGIN_FORM_DEFAULTS } from "../defaults/loginForm_default";
import "./LoginForm.css";

function LoginForm(props) {
  const {
    emailLabel,
    passwordLabel,
    emailPlaceholder,
    passwordPlaceholder,
    emailValue,
    passwordValue,
    buttonText,
    onSubmit,
    onEmailChange,
    onPasswordChange,
    error,
    success,
    isLoading,
    customClassName,
    emailFieldProps,
    passwordFieldProps,
    submitButtonClassName,
    errorClassName,
    successClassName,
    showLinks,
    signUpLink,
    resetPasswordLink,
  } = { ...LOGIN_FORM_DEFAULTS, ...props };

  return (
    <form className={`p-page__stack ${customClassName}`.trim()} onSubmit={onSubmit}>
      <InputField
        id="login-email"
        label={emailLabel}
        type="email"
        value={emailValue}
        placeholder={emailPlaceholder}
        onChange={onEmailChange}
        {...emailFieldProps}
      />

      <InputField
        id="login-password"
        label={passwordLabel}
        inputType="password"
        value={passwordValue}
        placeholder={passwordPlaceholder}
        onChange={onPasswordChange}
        {...passwordFieldProps}
      />

      {error ? <div className={errorClassName}>{error}</div> : null}

      {success ? <div className={successClassName}>{success}</div> : null}

      <Button
        type="primary"
        customClassName={submitButtonClassName}
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Envoi en cours..." : buttonText}
      </Button>

      {showLinks && (
        <div className="login-form__links">
          <p className="login-form__link-item">
            Pas encore inscrit?{" "}
            <a href={signUpLink} className="login-form__link">
              S'inscrire
            </a>
          </p>
          <p className="login-form__link-item">
            <a href={resetPasswordLink} className="login-form__link login-form__link--secondary">
              Mot de passe oublié?
            </a>
          </p>
        </div>
      )}
    </form>
  );
}

export default LoginForm;
