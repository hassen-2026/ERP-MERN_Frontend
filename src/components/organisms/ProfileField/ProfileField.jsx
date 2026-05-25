import Typography from "../../atoms/Typography/Typography";
import { Profile_fields_DEFAULTS } from "../defaults/ProfileField_default";
import "./ProfileField.css";

function ProfileField(props) {
  const {
    label,
    value,
    customClassName,
    labelClassName,
    valueClassName,
    containerClassName,
    icon,
  } = {
   ...Profile_fields_DEFAULTS,
    ...props,
  };

  return (
    <div className={`m-profile-field ${customClassName}`.trim()}>
      <div className={containerClassName}>
        {icon && <span className="m-profile-field__icon">{icon}</span>}
        <div className="m-profile-field__content">
          <Typography variant="text" className={labelClassName}>
            {label}
          </Typography>
          <Typography variant="text" className={valueClassName}>
            {value || "—"}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ProfileField;
