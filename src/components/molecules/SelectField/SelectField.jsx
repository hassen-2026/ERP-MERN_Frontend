import Select from "../../atoms/select/Select";
import Label from "../../atoms/label/Label";
import { SELECTFIELD_DEFAULTS } from "../defaults/selectField_default";
import "./SelectField.css";

function SelectField(props) {
  const {
    id,
    label,
    options,
    value,
    defaultValue,
    placeholder,
    required,
    error,
    containerClassName,
    defaultLabelClassName,
    errorClassName,
    customClassName,
    selectClassName,
    labelClassName,
    onChange,
  } = { ...SELECTFIELD_DEFAULTS, ...props };

  const errorId = id ? `${id}-error` : "";

  return (
    <div className={`${containerClassName} ${customClassName}`.trim()}>
      <Label htmlFor={id} customClassName={`${defaultLabelClassName} ${labelClassName}`.trim()} required={required}>
        {label}
      </Label>

      <Select
        id={id}
        value={value}
        defaultValue={defaultValue}
        options={options}
        placeholder={placeholder}
        customClassName={selectClassName}
        onChange={onChange}
      />

      {error !== "" ? (
        <div id={errorId} className={errorClassName}>
          {error}
        </div>
      ) : null}
    </div>
  );
}

export default SelectField;
