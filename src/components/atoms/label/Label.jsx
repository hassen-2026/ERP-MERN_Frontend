import { LABEL_DEFAULTS } from "../defaults/label_default";
import "./Label.css";

function Label(props) {
  const {
    htmlFor,
    children,
    customClassName,
    required,
  } = { ...LABEL_DEFAULTS, ...props };

  return (
    <label
      htmlFor={htmlFor}
      className={customClassName}
    >
      {children}
      {required ? " *" : ""}
    </label>
  );
}


export default Label;
