import { INPUT_DEFAULTS } from "../defaults/input_default";
import { Input as AntInput } from "antd";
import "./Input.css";

function Input(props) {
  const {
    id,
    type,
    value,
    defaultValue,
    placeholder,
    customClassName,
    onChange,
    required,
    readOnly,
    ariaInvalid,
    ariaDescribedBy,
    ...restProps
  } = { ...INPUT_DEFAULTS, ...props };

  const inputProps = {
    id,
    type,
    placeholder,
    className: customClassName,
    onChange,
    required,
    readOnly,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    ...restProps,
  };

  if (value !== undefined) {
    inputProps.value = value;
  } else {
    inputProps.defaultValue = defaultValue;
  }

  return (
    <AntInput {...inputProps} />
  );
}


export default Input;
