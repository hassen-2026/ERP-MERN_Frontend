import Button from "../../atoms/button/Button";
import InputField from "../../molecules/InputField/InputField";
import { RESET_PASSWORD_FORM_DEFAULTS } from "../defaults/resetPasswordForm_default";
import "./ResetPasswordForm.css";

function ResetPasswordForm(props) {
  const {
    newPasswordLabel,
    confirmPasswordLabel,
    newPasswordPlaceholder,
    confirmPasswordPlaceholder,
    buttonText,
    onSubmit,
    newPasswordValue,
    confirmPasswordValue,
    onNewPasswordChange,
    onConfirmPasswordChange,
    error,
    success,
    isLoading,
    customClassName,
    newPasswordFieldProps,
    confirmPasswordFieldProps,
    submitButtonClassName,
    errorClassName,
    successClassName,
  } = { ...RESET_PASSWORD_FORM_DEFAULTS, ...props };

  return (
    <form className={`p-page__stack ${customClassName}`.trim()} onSubmit={onSubmit}>
      <InputField
        id="reset-password-new-password"
        label={newPasswordLabel}
        inputType="password"
        value={newPasswordValue}
        placeholder={newPasswordPlaceholder}
        onChange={onNewPasswordChange}
        disabled={isLoading}
        {...newPasswordFieldProps}
      />

      <InputField
        id="reset-password-confirm-password"
        label={confirmPasswordLabel}
        inputType="password"
        value={confirmPasswordValue}
        placeholder={confirmPasswordPlaceholder}
        onChange={onConfirmPasswordChange}
        disabled={isLoading}
        {...confirmPasswordFieldProps}
      />

      {error ? <div className={errorClassName}>{error}</div> : null}

      {success ? <div className={successClassName}>{success}</div> : null}

      <Button
        type="primary"
        customClassName={submitButtonClassName}
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Traitement..." : buttonText}
      </Button>
    </form>
  );
}

export default ResetPasswordForm;