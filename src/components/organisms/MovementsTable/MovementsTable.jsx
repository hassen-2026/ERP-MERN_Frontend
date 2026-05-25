import "./MovementsTable.css";
import DataTable from "../../molecules/DataTable/DataTable";
import { MOVEMENTS_TABLE_DEFAULTS } from "../defaults/movementsTable_default";

function MovementsTable(props) {
  const { title, rows, customClassName, titleClassName, tableClassName, loading, error } = {
    ...MOVEMENTS_TABLE_DEFAULTS,
    ...props,
  };

  const getMovementBadgeClassName = (type) => {
    const normalizedType = String(type || "").trim().toLowerCase();

    if (
      normalizedType === "in" ||
      normalizedType === "entrant" ||
      normalizedType.includes("entrée") ||
      normalizedType.includes("entree") ||
      normalizedType.includes("buy") ||
      normalizedType.includes("achat") ||
      normalizedType.includes("purchase")
    ) {
      return "o-movements__badge--in";
    }

    if (
      normalizedType === "out" ||
      normalizedType === "sortant" ||
      normalizedType.includes("sortie") ||
      normalizedType.includes("sell") ||
      normalizedType.includes("vente")
    ) {
      return "o-movements__badge--out";
    }

    return "";
  };

  const columns = [
    { key: "product", header: "Produit" },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className={`o-movements__badge ${getMovementBadgeClassName(row.type)}`.trim()}>
          {row.type}
        </span>
      ),
    },
    { key: "qty", header: "Quantité" },
    { key: "reference", header: "Référence" },
    { key: "date", header: "Date" },
  ];

  return (
    <DataTable
      title={title}
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      loadingMessage="Chargement des mouvements..."
      emptyMessage="Aucun mouvement disponible."
      sectionClassName={`o-movements ${customClassName}`.trim()}
      titleClassName={`o-movements__title ${titleClassName}`.trim()}
      tableClassName={`o-movements__table ${tableClassName}`.trim()}
      getRowKey={(row, index) => row?.reference ?? index}
    />
  );
}

export default MovementsTable;
