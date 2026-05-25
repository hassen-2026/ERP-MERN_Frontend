import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchBonCommandes } from "../../../../redux/reducers/BonCommandeReducer";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

function BonCommandePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bonState = useSelector((state) => state.bonCommandes || {});
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");

  useEffect(() => {
    dispatch(fetchBonCommandes());
  }, [dispatch]);

  const rows = bonState.items || [];

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !search ||
        [row.bonNumber, row.commandeNumber, row.createdByName, row.note].join(" ").toLowerCase().includes(search);
      const matchesStatus = statusValue === "all" || row.status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchValue, statusValue]);

  const columns = [
    { key: "bonNumber", header: "N° Bon" },
    { key: "date", header: "Date" },
    { key: "commandeNumber", header: "Commande" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => (
        <span
          className={`p-pill ${
            row.status === "DELIVERED"
              ? "p-pill--stock"
              : row.status === "CANCELLED"
                ? "p-pill--danger"
                : "p-pill--warning"
          }`.trim()}
        >
          {row.statusLabel}
        </span>
      ),
    },
    { key: "lineCount", header: "Lignes" },
    { key: "remainingLinesCount", header: "Lignes restantes" },
    {
      key: "totalHT",
      header: "HT",
      render: (row) => Number(row.totalHT || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    {
      key: "tvaAmount",
      header: "TVA",
      render: (row) => Number(row.tvaAmount || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    { key: "totalAmountDisplay", header: "TTC" },
    { key: "createdByName", header: "Créé par" },
  ];

  const filterFields = [
    {
      type: "input",
      id: "bon-commande-search",
      label: "Rechercher",
      placeholder: "Numéro, commande, créateur...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "bon-commande-status",
      label: "Statut",
      value: statusValue,
      options: [
        { label: "Tous", value: "all" },
        { label: "En attente", value: "PENDING" },
        { label: "Partiellement livré", value: "PARTIALLY_DELIVERED" },
        { label: "Livré", value: "DELIVERED" },
        { label: "Annulé", value: "CANCELLED" },
      ],
      onChange: (value) => setStatusValue(value),
    },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Bons de commande"
          subtitle="Préparez les quantités à livrer par ligne de commande."
          actions={[
            {
              id: "add-bon-commande",
              label: "+ Ajouter Bon",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              icon: <PlusOutlined />,
              onClick: () => navigate("/bon-commandes/add"),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-product-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des bons de commande"
          rows={filteredRows}
          columns={columns}
          getActions={(row) => [
            {
              id: `detail-${row.id}`,
              kind: "detail",
              label: "Détail",
              onClick: () => navigate(`/bon-commandes/${row.id}`),
            },
          ]}
          loading={Boolean(bonState.loading)}
          error={bonState.error || ""}
          loadingMessage="Chargement des bons de commande..."
          emptyMessage="Aucun bon de commande disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-supplier-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default BonCommandePage;
