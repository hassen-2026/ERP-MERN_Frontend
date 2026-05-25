import Button from "../../atoms/button/Button";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import { SIGNUP_FORM_DEFAULTS } from "../defaults/signUpForm_default";
import "./SignUpForm.css";

function SignUpForm(props) {
  const {
    firstNameLabel,
    lastNameLabel,
    emailLabel,
    passwordLabel,
    confirmPasswordLabel,
    roleLabel,
    imageLabel,
    firstNamePlaceholder,
    lastNamePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    confirmPasswordPlaceholder,
    buttonText,
    onSubmit,
    firstNameValue,
    lastNameValue,
    emailValue,
    passwordValue,
    confirmPasswordValue,
    roleValue,
    imageValue,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onRoleChange,
    onImageChange,
    error,
    customClassName,
    firstNameFieldProps,
    lastNameFieldProps,
    emailFieldProps,
    passwordFieldProps,
    confirmPasswordFieldProps,
    roleFieldProps,
    imageFieldProps,
    submitButtonClassName,
    errorClassName,
    roles,
  } = { ...SIGNUP_FORM_DEFAULTS, ...props };

  return (
    <form className={`p-page__stack ${customClassName}`.trim()} onSubmit={onSubmit}>
      <div className="signup-form__row">
        <InputField
          id="signup-firstName"
          label={firstNameLabel}
          value={firstNameValue}
          placeholder={firstNamePlaceholder}
          onChange={onFirstNameChange}
          {...firstNameFieldProps}
        />

        <InputField
          id="signup-lastName"
          label={lastNameLabel}
          value={lastNameValue}
          placeholder={lastNamePlaceholder}
          onChange={onLastNameChange}
          {...lastNameFieldProps}
        />
      </div>

      <InputField
        id="signup-email"
        label={emailLabel}
        type="email"
        value={emailValue}
        placeholder={emailPlaceholder}
        onChange={onEmailChange}
        {...emailFieldProps}
      />

      <InputField
        id="signup-password"
        label={passwordLabel}
        inputType="password"
        value={passwordValue}
        placeholder={passwordPlaceholder}
        onChange={onPasswordChange}
        {...passwordFieldProps}
      />

      <InputField
        id="signup-confirmPassword"
        label={confirmPasswordLabel}
        inputType="password"
        value={confirmPasswordValue}
        placeholder={confirmPasswordPlaceholder}
        onChange={onConfirmPasswordChange}
        {...confirmPasswordFieldProps}
      />

      <SelectField
        id="signup-role"
        label={roleLabel}
        value={roleValue}
        onChange={onRoleChange}
        options={roles}
        {...roleFieldProps}
      />

      <InputField
        id="signup-image"
        label={imageLabel}
        inputType="file"
        onChange={onImageChange}
        value={imageValue}
        {...imageFieldProps}
        inputProps={{ accept: "image/*" }}
      />

      {error ? <div className={errorClassName}>{error}</div> : null}

      <Button type="primary" customClassName={submitButtonClassName} onClick={onSubmit}>
        {buttonText}
      </Button>
    </form>
  );
}

export default SignUpForm;
