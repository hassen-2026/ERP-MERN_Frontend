import { Alert as AntAlert } from "antd";
import { ALERT_DEFAULTS } from "../defaults/alert_default";
import "./Alert.css";

function Alert(props) {
  const {
    message,
    type,
    showIcon,
    closable,
    customClassName,
    description,
    onClose,
  } = { ...ALERT_DEFAULTS, ...props };

  return (
    <AntAlert
      message={message}
      description={description || undefined}
      type={type}
      showIcon={showIcon}
      closable={closable}
      className={customClassName}
      onClose={onClose}
    />
  );
}

export default Alert;
