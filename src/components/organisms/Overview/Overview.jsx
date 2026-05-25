import ProductInfoItem from "../../molecules/ProductInfoItem/ProductInfoItem";
import DetailDataTable from "../DetailDataTable/DetailDataTable";
import { OVERVIEW_DEFAULTS } from "../defaults/overview_default";
import "./Overview.css";

function Overview(props) {
  const {
    item,
    movements,
    tableSections,
    movementsLoading,
    movementsError,
    containerClassName,
    itemSectionTitle,
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
    infoExtraContent,
  } = {
    ...OVERVIEW_DEFAULTS,
    ...props,
  };

  const resolvedInfoRows = infoRows.map((row) => {
    const rawValue = row?.value !== undefined ? row.value : item?.[row?.key];
    const formattedValue = typeof row?.formatter === "function" ? row.formatter(rawValue, item) : rawValue;

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

  const resolvedTableSections = Array.isArray(tableSections) && tableSections.length > 0
    ? tableSections
    : [
      {
        title: movementsSectionTitle,
        rows: limitedMovements,
        columns: resolvedMovementColumns,
        loading: movementsLoading,
        error: movementsError,
        loadingMessage: loadingText,
        emptyMessage: emptyMovementsText,
        sectionClassName: movementsTableSectionClassName,
        tableClassName: movementsTableClassName,
        stateRowClassName: movementsTableStateClassName,
        errorRowClassName: movementsTableErrorClassName || movementErrorClassName,
        getRowKey: getMovementKey,
      },
    ];

  return (
    <section className={containerClassName}>
      <article className={cardClassName}>
        <h3 className={cardTitleClassName}>{itemSectionTitle}</h3>
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
          {infoExtraContent}
        </div>
      </article>

      <div className={movementsContainerClassName}>
        {resolvedTableSections.map((section, index) => (
          <article key={section?.title || index} className={cardClassName}>
            <h3 className={cardTitleClassName}>{section?.title || movementsSectionTitle}</h3>
            <div className={cardBodyClassName}>
              <DetailDataTable
                rows={section?.rows || []}
                columns={section?.columns || []}
                loading={Boolean(section?.loading)}
                error={section?.error || ""}
                loadingMessage={section?.loadingMessage || loadingText}
                emptyMessage={section?.emptyMessage || emptyMovementsText}
                sectionClassName={section?.sectionClassName || movementsTableSectionClassName}
                tableClassName={section?.tableClassName || movementsTableClassName}
                stateRowClassName={section?.stateRowClassName || movementsTableStateClassName}
                errorRowClassName={section?.errorRowClassName || movementsTableErrorClassName || movementErrorClassName}
                getRowKey={section?.getRowKey || getMovementKey}
                getActions={section?.getActions}
                actionColumnHeader={section?.actionColumnHeader}
                actionGroupClassName={section?.actionGroupClassName}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Overview;
