import { PRODUCT_INFO_ITEM_DEFAULTS } from "../defaults/productInfoItem_default";
import "./ProductInfoItem.css";

function ProductInfoItem(props) {
  const {
    label,
    value,
    rowClassName,
    labelClassName,
    valueClassName,
  } = {
    ...PRODUCT_INFO_ITEM_DEFAULTS,
    ...props,
  };

  return (
    <div className={rowClassName}>
      <span className={labelClassName}>{label}</span>
      <span className={valueClassName}>{value ?? "-"}</span>
    </div>
  );
}

export default ProductInfoItem;
