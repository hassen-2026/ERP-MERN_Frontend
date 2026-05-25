import BrandText from "../../atoms/brandText/BrandText";

import { TOPBAR_BRAND_DEFAULTS } from "../defaults/topbarBrand_default";
import "./TopbarBrand.css";

function TopbarBrand(props) {
  const {
    brand,
    menuIcon,
    customClassName,
   
    brandClassName,

  } = { ...TOPBAR_BRAND_DEFAULTS, ...props };

  return (
    <div className={customClassName}>
      
      <BrandText text={brand} customClassName={brandClassName} as="span" />
    </div>
  );
}

export default TopbarBrand;
