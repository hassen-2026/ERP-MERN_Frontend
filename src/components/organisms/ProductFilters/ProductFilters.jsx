import FilterForm from "../FilterForm/FilterForm";
import { PRODUCT_FILTERS_DEFAULTS } from "../defaults/productFilters_default";
import "./ProductFilters.css";

function ProductFilters(props) {
  const {
    searchLabel,
    categoryLabel,
    stockLabel,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    categoryValue,
    onCategoryChange,
    categoryOptions,
    stockValue,
    onStockChange,
    stockOptions,
    sectionClassName,
    gridClassName,
    fieldClassName,
    controlClassName,
    labelClassName,
  } = {
    ...PRODUCT_FILTERS_DEFAULTS,
    ...props,
  };

  const fields = [
    {
      type: "input",
      id: "product-search",
      label: searchLabel,
      placeholder: searchPlaceholder,
      value: searchValue,
      onChange: onSearchChange,
    },
    {
      type: "select",
      id: "product-category",
      label: categoryLabel,
      value: categoryValue,
      options: categoryOptions,
      onChange: onCategoryChange,
    },
    {
      type: "select",
      id: "product-stock",
      label: stockLabel,
      value: stockValue,
      options: stockOptions,
      onChange: onStockChange,
    },
  ];

  return (
    <FilterForm
      fields={fields}
      sectionClassName={sectionClassName}
      gridClassName={gridClassName}
      fieldClassName={fieldClassName}
      controlClassName={controlClassName}
      labelClassName={labelClassName}
    />
  );
}

export default ProductFilters;
