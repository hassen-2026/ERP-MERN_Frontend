import { useMemo } from "react";
import DataTable from "../DataTable/DataTable";

function SelectableLinesTable({
  title = "Lignes en attente",
  rows = [],
  columns = [],
  selectedLineIds = [],
  onToggleLine = () => {},
  emptyMessage = "Aucune ligne disponible.",
  sectionClassName = "p-card",
  tableClassName = "p-table",
  stateRowClassName = "p-data-table__state",
  errorRowClassName = "p-data-table__state--error",
  error = "",
}) {
  const mergedColumns = useMemo(
    () => [
      {
        key: "selection",
        title: "Sélection",
        render: (row) => (
          <input
            type="checkbox"
            checked={selectedLineIds.includes(String(row.id))}
            onChange={() => onToggleLine(row.id)}
          />
        ),
      },
      ...columns,
    ],
    [columns, onToggleLine, selectedLineIds]
  );

  return (
    <>
      <h4>{title} ({rows.length})</h4>
      <DataTable
        rows={rows}
        columns={mergedColumns}
        enablePagination={false}
        emptyMessage={emptyMessage}
        error={error}
        sectionClassName={sectionClassName}
        tableClassName={tableClassName}
        stateRowClassName={stateRowClassName}
        errorRowClassName={errorRowClassName}
        getRowKey={(row) => row.id}
      />
    </>
  );
}

export default SelectableLinesTable;