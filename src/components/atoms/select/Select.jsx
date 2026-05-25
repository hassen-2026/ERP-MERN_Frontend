import React from "react";
import { Select as AntSelect } from "antd";

import "./Select.css";
import { SELECT_DEFAULTS } from "../defaults/select_default";

function Select(props) {
  const {
    id,
    type,
    mode,
    value,
    defaultValue,
    options,
    placeholder,
    customClassName,
    onChange,
    ...rest
  } = { ...SELECT_DEFAULTS, ...props };

  const resolvedMode = mode || (type === "multiple" ? "multiple" : undefined);

  return (
    <AntSelect
      id={id}
      mode={resolvedMode}
      value={value}
      defaultValue={defaultValue}
      options={options}
      placeholder={placeholder}
      className={customClassName}
      onChange={onChange}
      {...rest}
    />
  );
}

export default Select;
