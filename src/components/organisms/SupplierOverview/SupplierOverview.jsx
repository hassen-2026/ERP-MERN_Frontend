import { useNavigate } from "react-router-dom";

import Button from "../../atoms/button/Button";
import ProductInfoItem from "../../molecules/ProductInfoItem/ProductInfoItem";
import DataTable from "../../molecules/DataTable/DataTable";
import { SUPPLIER_OVERVIEW_DEFAULTS } from "../defaults/supplierOverview_default";
import "./SupplierOverview.css";

function SupplierOverview(props) {
  const navigate = useNavigate();
  const {
    supplier,
    movements,
    movementsLoading,
    movementsError,
    containerClassName,
    supplierSectionTitle,
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
    ...SUPPLIER_OVERVIEW_DEFAULTS,
    ...props,
  };

  const resolvedInfoRows = infoRows.map((row) => {
    const rawValue = row?.value !== undefined ? row.value : supplier?.[row?.key];
    const formattedValue = typeof row?.formatter === "function" ? row.formatter(rawValue, supplier) : rawValue;

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

  const detailColumn = {
    key: "detail",
    header: "Detail",
    render: (achat) => (
      <Button
        variant="primary"
        customClassName="p-action-btn p-action-btn--info"
        onClick={() => navigate(`/achats/${achat.id}`)}
      >
        Détail
      </Button>
    ),
  };

  const columnsWithDetail = [...resolvedMovementColumns, detailColumn];

  return (
    <section className={containerClassName}>
      <article className={cardClassName}>
        <h3 className={cardTitleClassName}>{supplierSectionTitle}</h3>
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
              columns={columnsWithDetail}
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

export default SupplierOverview;
