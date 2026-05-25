import { BRAND_TEXT_DEFAULTS } from "../defaults/brandText_default";
import "./BrandText.css";

function BrandText(props) {
  const { text, customClassName, as } = { ...BRAND_TEXT_DEFAULTS, ...props };
  const Component = as;

  return <Component className={customClassName}>{text}</Component>;
}

export default BrandText;
