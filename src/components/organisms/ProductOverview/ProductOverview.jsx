import ProductInfoItem from "../../molecules/ProductInfoItem/ProductInfoItem";
import DataTable from "../../molecules/DataTable/DataTable";
import { PRODUCT_OVERVIEW_DEFAULTS } from "../defaults/productOverview_default";
import "./ProductOverview.css";

function ProductOverview(props) {
  const {
    product,
    movements,
    movementsLoading,
    movementsError,
    containerClassName,
    productSectionTitle,
    movementsSectionTitle,
    infoRows,
    movementLimit,
    loadingText,
    emptyMovementsText,
    cardClassName,
    cardTitleClassName,
    cardBodyClassName,
    infoRowClassName,
    infoLabelClassName,
    infoValueClassName,
    movementsContainerClassName,
    movementColumns,
    movementsTableSectionClassName,
    movementsTableClassName,
    movementsTableStateClassName,
    movementsTableErrorClassName,
    movementErrorClassName,
    getMovementKey,
    renderMovementRow,
  } = {
    ...PRODUCT_OVERVIEW_DEFAULTS,
    ...props,
  };

  const resolvedInfoRows = infoRows.map((row) => {
    const rawValue = row?.value !== undefined ? row.value : product?.[row?.key];
    const formattedValue = typeof row?.formatter === "function" ? row.formatter(rawValue, product) : rawValue;

    return {
      label: row?.label || "-",
      value: formattedValue ?? "-",
    };
  });

  const limitedMovements = movements.slice(0, movementLimit);

  const resolvedMovementColumns = typeof renderMovementRow === "function"
    ? [
      {
        key: "movement",
        header: "Mouvement",
        render: (movement, index) => renderMovementRow(movement, index),
      },
    ]
    : movementColumns;

  return (
    <section className={containerClassName}>
      <article className={cardClassName}>
        <h3 className={cardTitleClassName}>{productSectionTitle}</h3>
        <div className={cardBodyClassName}>
          {resolvedInfoRows.map((row) => (
            <ProductInfoItem
              key={row.label}
              label={row.label}
              value={row.value}
              rowClassName={infoRowClassName}
              labelClassName={infoLabelClassName}
              valueClassName={infoValueClassName}
            />
          ))}
        </div>
      </article>

      <article className={cardClassName}>
        <h3 className={cardTitleClassName}>{movementsSectionTitle}</h3>
        <div className={cardBodyClassName}>
          <div className={movementsContainerClassName}>
            <DataTable
              rows={limitedMovements}
              columns={resolvedMovementColumns}
              loading={movementsLoading}
              error={movementsError}
              loadingMessage={loadingText}
              emptyMessage={emptyMovementsText}
              sectionClassName={movementsTableSectionClassName}
              tableClassName={movementsTableClassName}
              stateRowClassName={movementsTableStateClassName}
              errorRowClassName={movementsTableErrorClassName || movementErrorClassName}
              getRowKey={getMovementKey}
            />
          </div>
        </div>
      </article>
    </section>
  );
}

export default ProductOverview;
