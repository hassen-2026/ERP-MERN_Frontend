import Button from "../../atoms/button/Button";
import InputField from "../../molecules/InputField/InputField";
import { FORGET_PASSWORD_FORM_DEFAULTS } from "../defaults/forgetPasswordForm_default";
import "./ForgetPasswordForm.css";

function ForgetPasswordForm(props) {
  const {
    emailLabel,
    emailPlaceholder,
    buttonText,
    onSubmit,
    emailValue,
    onEmailChange,
    error,
    success,
    isLoading,
    customClassName,
    emailFieldProps,
    submitButtonClassName,
    errorClassName,
    successClassName,
    infoText,
  } = { ...FORGET_PASSWORD_FORM_DEFAULTS, ...props };

  return (
    <form className={`p-page__stack ${customClassName}`.trim()} onSubmit={onSubmit}>
      {infoText ? <p className="forget-password-form__info">{infoText}</p> : null}

      <InputField
        id="forget-password-email"
        label={emailLabel}
        type="email"
        value={emailValue}
        placeholder={emailPlaceholder}
        onChange={onEmailChange}
        disabled={isLoading}
        {...emailFieldProps}
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
    </form>
  );
}

export default ForgetPasswordForm;