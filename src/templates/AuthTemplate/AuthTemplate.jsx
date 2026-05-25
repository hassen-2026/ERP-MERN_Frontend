import LoginForm from "../../components/organisms/LoginForm/LoginForm";
import SignUpForm from "../../components/organisms/SignUpForm/SignUpForm";
import ForgetPasswordForm from "../../components/organisms/ForgetPasswordForm/ForgetPasswordForm";
import ResetPasswordForm from "../../components/organisms/ResetPasswordForm/ResetPasswordForm";
import { AUTH_TEMPLATE_DEFAULTS } from "../defaults/authTemplate_default";
import "./AuthTemplate.css";
import { LockOutlined } from "@ant-design/icons";

function AuthTemplate(props) {
  const {
    title,
    subtitle,
    brand,
    footer,
    alertMessage,
    loginFormProps,
    children,
    containerClassName,
    cardClassName,
    headerClassName,
    bodyClassName,
  } = { ...AUTH_TEMPLATE_DEFAULTS, ...props };

  const renderAuthForm = () => {
    switch (loginFormProps?.formType) {
      case "signup":
        return <SignUpForm {...loginFormProps} />;
      case "forget-password":
        return <ForgetPasswordForm {...loginFormProps} />;
      case "reset-password":
        return <ResetPasswordForm {...loginFormProps} />;
      case "login":
      default:
        return <LoginForm {...loginFormProps} />;
    }
  };

  return (
    <div className={`p-login ${containerClassName}`.trim()}>
      <div className={`p-login__card ${cardClassName}`.trim()}>
        <div className={`p-login__header ${headerClassName}`.trim()}>
          <LockOutlined className="p-login__icon" />
          <h2>{brand}</h2>
        </div>
        <div className={`p-login__body ${bodyClassName}`.trim()}>
          {alertMessage ? <div className="p-login__alert">{alertMessage}</div> : null}
          {title ? <h3>{title}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
          {children ? children : renderAuthForm()}
          {footer ? (
            <div className="p-login__footer" dangerouslySetInnerHTML={{ __html: footer }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AuthTemplate;
