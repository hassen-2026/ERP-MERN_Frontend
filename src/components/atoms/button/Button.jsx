import { BUTTON_DEFAULTS, BUTTON_VARIANT_CLASSNAMES } from "../defaults/button_default";
import './Button.css';
import { Button as AntButton } from "antd";
function Button(props) {
  const {
    type,
    htmlType,
    disabled,
    children,
    customClassName,
    onClick,
    variant
  } = { ...BUTTON_DEFAULTS, ...props };
    const variantClass = BUTTON_VARIANT_CLASSNAMES[variant];
  return (
    <div>
    <AntButton
      type={type}
      htmlType={htmlType}
      disabled={disabled}
      className={variantClass + " "+ customClassName}
      onClick={onClick}
    >
      {children}
    </AntButton>
    </div>

  );
}

export default Button;
