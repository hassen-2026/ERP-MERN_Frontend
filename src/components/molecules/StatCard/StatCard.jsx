import Typography from "../../atoms/Typography/Typography";
import { STAT_CARD_DEFAULTS } from "../defaults/statCard_default";

function StatCard(props) {
  const {
    value,
    label,
    customClassName,
    valueClassName,
    labelClassName,
    containerClassName,
    defaultValueClassName,
    defaultLabelClassName,
  } = {
    ...STAT_CARD_DEFAULTS,
    ...props,
  };

  const { style } = props;

  return (
    <div style={style} className={`${containerClassName} ${customClassName}`.trim()}>
      <Typography
        variant="title"
        level={3}
        className={`${defaultValueClassName} ${valueClassName}`.trim()}
      >
        {value}
      </Typography>
      <Typography variant="text" className={`${defaultLabelClassName} ${labelClassName}`.trim()}>
        {label}
      </Typography>
    </div>
  );
}

export default StatCard;
