import Input from "../../atoms/input/Input";
import Label from "../../atoms/label/Label";
import { INPUTFIELD_DEFAULTS } from "../defaults/inputField_default";
import "./InputField.css";

function InputField(props) {
  const {
    id,
    label,
    inputType,
    value,
    defaultValue,
    placeholder,
    required,
    readOnly,
    error,
    customClassName,
    inputClassName,
    labelClassName,
    errorClassName,
    onChange,
    inputProps,
  } = { ...INPUTFIELD_DEFAULTS, ...props };

  const errorId = id ? `${id}-error` : "";

  return (
    <div className={customClassName}>
      <Label htmlFor={id} customClassName={labelClassName} required={required}>
        {label}
      </Label>

      <Input
        id={id}
        type={inputType}
        value={inputType === "file" ? undefined : value}
        defaultValue={inputType === "file" ? undefined : defaultValue}
        placeholder={placeholder}
        customClassName={inputClassName}
        onChange={onChange}
        readOnly={readOnly}
        ariaInvalid={error !== ""}
        ariaDescribedBy={error ? errorId : ""}
        required={required}
        {...inputProps}
      />

      {error !== "" ? (
        <div id={errorId} className={errorClassName}>
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default InputField;
